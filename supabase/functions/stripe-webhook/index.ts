import Stripe from 'npm:stripe@14'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-04-10' })
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

Deno.serve(async (req) => {
  const body = await req.text()

  // Explicit null check: a missing signature header means the request did not
  // come from Stripe (or a proxy stripped it). Reject before touching the DB.
  const sig = req.headers.get('stripe-signature')
  if (!sig) return new Response('Missing Stripe-Signature header', { status: 400 })

  let event: Stripe.Event
  try {
    // constructEventAsync verifies the HMAC-SHA256 signature AND rejects events
    // with a timestamp older than 5 minutes, blocking replay attacks.
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

    // Idempotency check: if this stripe_subscription_id is already in the DB,
    // this event was already processed (Stripe retry or duplicate delivery).
    // Return 200 immediately — Stripe will stop retrying.
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

    const stripeSub = await stripe.subscriptions.retrieve(stripeSubId)
    const renewsAt = new Date(stripeSub.current_period_end * 1000).toISOString()

    // activate_subscription() runs both the cancel and the insert in a single
    // Postgres transaction. If either step fails the whole thing rolls back,
    // so we can never be left with a cancelled-but-not-yet-activated state.
    // The unique constraint on stripe_subscription_id means a race-condition
    // duplicate will fail at the DB level on insert rather than creating a
    // duplicate row, and the resulting 500 causes Stripe to retry, which then
    // hits the idempotency check above.
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
      // Return 500 so Stripe retries. The idempotency check above ensures
      // that if the RPC actually succeeded but the response timed out, the
      // retry will be skipped harmlessly.
      return new Response('DB error', { status: 500 })
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    // Naturally idempotent: UPDATE to 'cancelled' twice produces the same row.
    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('stripe_subscription_id', sub.id)
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    const renewsAt = new Date(sub.current_period_end * 1000).toISOString()
    const status = sub.status === 'active' ? 'active' : sub.status === 'canceled' ? 'cancelled' : 'expired'
    // Naturally idempotent: same UPDATE applied twice produces the same row.
    await supabase
      .from('subscriptions')
      .update({ renews_at: renewsAt, status })
      .eq('stripe_subscription_id', sub.id)
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
