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

// SITE_URL must be set as a Supabase Edge Function secret.
// Do not accept this from the request body — callers cannot be trusted.
const SITE_URL = Deno.env.get('SITE_URL')!

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

    const { plan } = await req.json() as { plan: string }
    if (!PRICE_IDS[plan]) return new Response('Invalid plan', { status: 400 })

    // Re-use the existing Stripe customer if this user has subscribed before
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .not('stripe_customer_id', 'is', null)
      .maybeSingle()

    const customerId = existing?.stripe_customer_id ?? undefined

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      success_url: `${SITE_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/subscribe`,
      metadata: { user_id: user.id, plan, amount_monthly: String(AMOUNTS[plan]) },
      subscription_data: {
        metadata: { user_id: user.id, plan },
      },
    })

    return new Response(JSON.stringify({ url: session.url }), {
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
