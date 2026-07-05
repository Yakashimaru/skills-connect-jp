import Stripe from 'npm:stripe@14'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-04-10' })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
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

    // Issue 4 fix: use select() not maybeSingle() — a user may have multiple
    // active rows due to a re-subscribe race (Issue 1). maybeSingle() throws
    // PGRST116 when >1 row is returned, causing a silent 500 and leaving the
    // user unable to cancel. We cancel ALL active subscriptions instead.
    const { data: subs } = await supabase
      .from('subscriptions')
      .select('id, stripe_subscription_id, cancelled_at')
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (!subs || subs.length === 0) {
      return new Response(JSON.stringify({ error: 'No active subscription found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    for (const sub of subs) {
      if (sub.cancelled_at) continue

      if (!sub.stripe_subscription_id) {
        // Orphaned DB row with no Stripe backing — just mark it cancelled.
        await supabase
          .from('subscriptions')
          .update({ cancelled_at: new Date().toISOString() })
          .eq('id', sub.id)
        continue
      }

      // Cancel at period end: user keeps access until renews_at.
      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        cancel_at_period_end: true,
      })

      await supabase
        .from('subscriptions')
        .update({ cancelled_at: new Date().toISOString() })
        .eq('id', sub.id)
    }

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
