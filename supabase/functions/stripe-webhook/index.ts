import Stripe from 'npm:stripe@14'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-04-10' })
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

Deno.serve(async (req) => {
  const body = await req.text()

  const sig = req.headers.get('stripe-signature')
  if (!sig) return new Response('Missing Stripe-Signature header', { status: 400 })

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return new Response('Bad signature', { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { user_id, plan, amount_monthly } = session.metadata ?? {}
    if (!user_id || !plan) return new Response('Missing metadata', { status: 400 })

    const stripeSubId = session.subscription as string
    const customerId = session.customer as string

    // Idempotency: already processed → skip.
    const { data: alreadyProcessed } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('stripe_subscription_id', stripeSubId)
      .maybeSingle()

    if (alreadyProcessed) {
      return new Response(JSON.stringify({ received: true, skipped: true }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Cancel any prior active Stripe subscriptions for this user that are not
    // the new one. The DB rows are cleaned up by activate_subscription() below,
    // but without this step the old Stripe subscription keeps billing.
    const { data: oldSubs } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', user_id)
      .eq('status', 'active')
      .not('stripe_subscription_id', 'eq', stripeSubId)
      .not('stripe_subscription_id', 'is', null)

    for (const old of oldSubs ?? []) {
      try {
        await stripe.subscriptions.cancel(old.stripe_subscription_id)
      } catch (e) {
        // Log but don't fail — the sub may already be cancelled in Stripe.
        console.error('Failed to cancel old Stripe subscription:', old.stripe_subscription_id, e)
      }
    }

    const stripeSub = await stripe.subscriptions.retrieve(stripeSubId)
    const rawSubEnd = stripeSub.current_period_end ?? (stripeSub as any).billing_cycle_anchor ?? null
    const renewsAt = rawSubEnd
      ? new Date(rawSubEnd * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    const { error: rpcError } = await supabase.rpc('activate_subscription', {
      p_user_id:        user_id,
      p_plan:           plan,
      p_amount_monthly: Number(amount_monthly),
      p_stripe_sub_id:  stripeSubId,
      p_stripe_cust_id: customerId,
      p_renews_at:      renewsAt,
    })

    if (rpcError) {
      console.error('activate_subscription RPC failed:', rpcError)
      return new Response('DB error', { status: 500 })
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('stripe_subscription_id', sub.id)
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    // current_period_end was removed from the top-level subscription object in
    // newer Stripe API versions. Fall back to billing_cycle_anchor if missing.
    const rawEnd = sub.current_period_end ?? (sub as any).billing_cycle_anchor ?? null
    if (!rawEnd) {
      console.error('customer.subscription.updated: no period end field found', sub)
      return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
    const renewsAt = new Date(rawEnd * 1000).toISOString()

    // Only map statuses we explicitly understand.
    // past_due means Stripe is retrying payment — do NOT revoke access yet.
    // Access is only revoked when customer.subscription.deleted fires (all
    // retries exhausted) or when the customer cancels intentionally.
    if (sub.status === 'active') {
      await supabase
        .from('subscriptions')
        .update({ status: 'active', renews_at: renewsAt })
        .eq('stripe_subscription_id', sub.id)
    } else if (sub.status === 'canceled') {
      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled', renews_at: renewsAt })
        .eq('stripe_subscription_id', sub.id)
    }
    // past_due, incomplete, trialing, unpaid: update renews_at only,
    // leave status as-is so the user keeps access during Stripe's retry window.
    else {
      await supabase
        .from('subscriptions')
        .update({ renews_at: renewsAt })
        .eq('stripe_subscription_id', sub.id)
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
