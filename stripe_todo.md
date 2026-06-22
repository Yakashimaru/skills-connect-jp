# Stripe Integration Setup Checklist

## 1. Stripe Dashboard — Create Products & Prices

1. Go to **stripe.com/dashboard** → make sure you're in **Test mode** first (toggle top-left)
2. Navigate to **Product catalogue → Add product** and create three products:

   | Product name  | Price    | Currency | Billing  |
   |---------------|----------|----------|----------|
   | Standard Plan | ¥5,000   | JPY      | Monthly  |
   | Premium Plan  | ¥10,000  | JPY      | Monthly  |
   | Elite Plan    | ¥50,000  | JPY      | Monthly  |

   > **JPY note:** When entering the amount, type the whole yen amount (5000, not 500000). JPY is a zero-decimal currency — Stripe handles this automatically if you select JPY.

3. After creating each product, click into its price and copy the **Price ID** (starts with `price_`). You'll need all three.

---

## 2. Stripe Dashboard — Create Webhook Endpoint

1. Navigate to **Developers → Webhooks → Add endpoint**
2. Set the endpoint URL to:
   ```
   https://<your-supabase-project-ref>.supabase.co/functions/v1/stripe-webhook
   ```
   Find your project ref in Supabase dashboard → Settings → General → Reference ID

3. Under **Events to listen to**, select:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed` *(optional but recommended — fires when a renewal card declines; currently logged only, Stripe retries automatically, and `customer.subscription.deleted` fires if all retries fail)*

4. Click **Add endpoint**, then click into the webhook and reveal the **Signing secret** (starts with `whsec_`). Copy it.

---

## 3. Supabase — Run SQL Migrations

In Supabase dashboard → **SQL Editor**, run sections **5 and 6** from `extras.sql`:

**Section 5** — unique constraint (paste and run):
```sql
ALTER TABLE public.subscriptions
  ADD CONSTRAINT IF NOT EXISTS subscriptions_stripe_subscription_id_key
  UNIQUE (stripe_subscription_id);
```

**Section 6** — atomic activate function (paste and run the full `CREATE OR REPLACE FUNCTION` block from `extras.sql`).

---

## 4. Supabase — Set Edge Function Secrets

In Supabase dashboard → **Edge Functions → Manage secrets**, add all of these:

| Secret name                  | Where to get it                                    |
|------------------------------|----------------------------------------------------|
| `STRIPE_SECRET_KEY`          | Stripe → Developers → API keys → Secret key        |
| `STRIPE_WEBHOOK_SECRET`      | Stripe → Developers → Webhooks → your endpoint → Signing secret |
| `STRIPE_STANDARD_PRICE_ID`   | Stripe → Product catalogue → Standard Plan → price ID |
| `STRIPE_PREMIUM_PRICE_ID`    | Stripe → Product catalogue → Premium Plan → price ID  |
| `STRIPE_ELITE_PRICE_ID`      | Stripe → Product catalogue → Elite Plan → price ID    |
| `SITE_URL`                   | Your app's URL, e.g. `https://www.kaiyui.com`      |

> For local/staging testing, set `SITE_URL` to your staging URL or `http://localhost:5173`.

---

## 5. Deploy Edge Functions

Run these from the project root (requires Supabase CLI logged in):

```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
supabase functions deploy cancel-subscription
```

---

## 6. Test the Full Flow (Test Mode)

1. Run the app locally (`npm run dev`)
2. Log in as a test user and go to `/subscribe`
3. Click a plan — you should be redirected to Stripe Checkout
4. Use Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC
5. Complete payment → should redirect to `/subscribe/success`
6. Check Supabase → Table Editor → `subscriptions` — a new row should appear with `status = active`
7. In Stripe dashboard → Webhooks → your endpoint → check that `checkout.session.completed` shows as delivered successfully

### Test cancellation
1. In Stripe dashboard → Customers → find your test customer → cancel their subscription
2. Check that the `subscriptions` row updates to `status = cancelled`

### Test duplicate webhook delivery (idempotency)
1. In Stripe dashboard → Webhooks → your endpoint → find a `checkout.session.completed` event → **Resend**
2. The function should return `{ received: true, skipped: true }` and no duplicate row should appear in the DB

---

## 7. Go Live

When ready to accept real payments:

1. In Stripe dashboard, **switch to Live mode** (toggle top-left)
2. Repeat steps 1–2 (create the same products and webhook endpoint in Live mode)
3. In Supabase, update all secrets with the **live** values (live secret key, live webhook secret, live price IDs)
4. Update `SITE_URL` to your production URL if it isn't already
5. Redeploy the edge functions so they pick up the updated secrets:
   ```bash
   supabase functions deploy create-checkout-session
   supabase functions deploy stripe-webhook
   ```
