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

// Issue 3 fix: if set, apply this coupon to the checkout session so the
// advertised trial price is actually charged. Create a "50% off first invoice"
// coupon in Stripe dashboard and set its ID as this secret.
// If not set, the full price is charged — which would mismatch the UI.
const TRIAL_COUPON_ID = Deno.env.get('STRIPE_TRIAL_COUPON_ID') ?? null

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

    // Check for any prior subscription (any status) to determine whether this
    // is a first-time subscriber. The trial coupon is for new customers only —
    // applying it to re-subscribers charges them ¥2,500 indefinitely on every
    // re-subscribe, costing revenue and creating false price expectations.
    const { data: priorSub } = await supabase
      .from('subscriptions')
      .select('id, stripe_customer_id')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const customerId = priorSub?.stripe_customer_id ?? undefined
    const isFirstTimeSubscriber = !priorSub
    const applyTrial = TRIAL_COUPON_ID && isFirstTimeSubscriber

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      // Only apply the trial coupon for first-time subscribers.
      ...(applyTrial ? { discounts: [{ coupon: TRIAL_COUPON_ID! }] } : {}),
      success_url: `${SITE_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/subscribe`,
      // amount_monthly is the regular recurring price, not the discounted
      // first-month price. The DB record reflects what the user pays from
      // month 2 onward. Check the Stripe invoice for the actual first charge.
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
