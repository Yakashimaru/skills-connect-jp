import Stripe from 'npm:stripe@14'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-04-10' })

const PRICE_IDS: Record<string, string> = {
  standard: Deno.env.get('STRIPE_STANDARD_PRICE_ID')!,
  premium:  Deno.env.get('STRIPE_PREMIUM_PRICE_ID')!,
  elite:    Deno.env.get('STRIPE_ELITE_PRICE_ID')!,
}

const AMOUNTS: Record<string, number> = {
  standard: 5000,
  premium:  10000,
  elite:    50000,
}

// Higher number = higher tier
const PLAN_ORDER: Record<string, number> = { standard: 1, premium: 2, elite: 3 }

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

    const { plan } = await req.json() as { plan: string }
    if (!PRICE_IDS[plan]) return new Response('Invalid plan', { status: 400 })

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id, plan')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!sub?.stripe_subscription_id) {
      return new Response(JSON.stringify({ error: 'No active subscription found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    if (sub.plan === plan) {
      return new Response(JSON.stringify({ error: 'Already on this plan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    const isUpgrade = (PLAN_ORDER[plan] ?? 0) > (PLAN_ORDER[sub.plan] ?? 0)

    const stripeSub = await stripe.subscriptions.retrieve(sub.stripe_subscription_id)
    const itemId = stripeSub.items.data[0]?.id
    if (!itemId) {
      return new Response(JSON.stringify({ error: 'Subscription item not found' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      items: [{ id: itemId, price: PRICE_IDS[plan] }],
      // Upgrades: charge the prorated difference immediately.
      // Downgrades: no proration — new lower price takes effect at next renewal.
      proration_behavior: isUpgrade ? 'create_prorations' : 'none',
    })

    await supabase
      .from('subscriptions')
      .update({ plan, amount_monthly: AMOUNTS[plan] })
      .eq('stripe_subscription_id', sub.stripe_subscription_id)

    return new Response(JSON.stringify({ success: true, isUpgrade }), {
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
