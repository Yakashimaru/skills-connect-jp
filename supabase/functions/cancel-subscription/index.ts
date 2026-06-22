import Stripe from 'npm:stripe@14'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-04-10' })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return new Response('Unauthorized', { status: 401 })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (authError || !user) return new Response('Unauthorized', { status: 401 })

    // Always look up by user_id from JWT — never trust a subscription ID from
    // the request body, as a user could cancel someone else's subscription.
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('id, stripe_subscription_id, cancelled_at')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    if (!sub) {
      return new Response(JSON.stringify({ error: 'No active subscription found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    if (sub.cancelled_at) {
      return new Response(JSON.stringify({ error: 'Subscription already cancelled' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    if (!sub.stripe_subscription_id) {
      return new Response(JSON.stringify({ error: 'No Stripe subscription linked' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    // Cancel at period end: user keeps access until renews_at, no more renewals.
    // Stripe fires customer.subscription.deleted at period end, which sets
    // status = 'cancelled' in our DB via the webhook.
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true,
    })

    // Record when user requested cancellation. Status stays 'active' so the
    // user keeps access until the end of the billing period.
    await supabase
      .from('subscriptions')
      .update({ cancelled_at: new Date().toISOString() })
      .eq('id', sub.id)

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }
})
