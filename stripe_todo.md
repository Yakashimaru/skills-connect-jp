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

## 2. Stripe Dashboard — Create Trial Coupon

The UI advertises a 50% first-month discount. This must be backed by a real Stripe coupon, otherwise customers see ¥2,500 but are charged ¥5,000.

1. Navigate to **Product catalogue → Coupons → Create coupon**
2. Set:
   - **Type**: Percentage discount
   - **Percentage off**: 50
   - **Duration**: Once (applies to first invoice only)
   - **Name**: First month 50% off (or similar)
3. Copy the **Coupon ID** (e.g. `FIRSTMONTH50`)
4. Add it as an edge function secret: `STRIPE_TRIAL_COUPON_ID = <coupon-id>`

> If you do **not** want a trial discount, remove the `trialPrices` and trial badge from `src/components/SubscriptionPlans.tsx` so the UI matches what Stripe actually charges.

---

## 3. Stripe Dashboard — Create Webhook Endpoint

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

## 4. Supabase — Run SQL Migrations

In Supabase dashboard → **SQL Editor**, run sections **5, 6, and 7** from `extras.sql`:

Run these sections from `extras.sql` in order:

**Section 5** — drop the dangerous INSERT policy:
```sql
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;
```

**Section 6** — unique constraint:
```sql
ALTER TABLE public.subscriptions
  ADD CONSTRAINT IF NOT EXISTS subscriptions_stripe_subscription_id_key
  UNIQUE (stripe_subscription_id);
```

**Section 7** — atomic activate function (paste and run the full `CREATE OR REPLACE FUNCTION` block from `extras.sql`).

---

## 5. Supabase — Set Edge Function Secrets

In Supabase dashboard → **Edge Functions → Manage secrets**, add all of these:

| Secret name                  | Where to get it                                    |
|------------------------------|----------------------------------------------------|
| `STRIPE_SECRET_KEY`          | Stripe → Developers → API keys → Secret key        |
| `STRIPE_WEBHOOK_SECRET`      | Stripe → Developers → Webhooks → your endpoint → Signing secret |
| `STRIPE_STANDARD_PRICE_ID`   | Stripe → Product catalogue → Standard Plan → price ID |
| `STRIPE_PREMIUM_PRICE_ID`    | Stripe → Product catalogue → Premium Plan → price ID  |
| `STRIPE_ELITE_PRICE_ID`      | Stripe → Product catalogue → Elite Plan → price ID    |
| `SITE_URL`                   | Your app's URL, e.g. `https://www.kaiyui.com`      |
| `STRIPE_TRIAL_COUPON_ID`     | Stripe coupon ID from Step 2 (50% off first month) |

> For local/staging testing, set `SITE_URL` to your staging URL or `http://localhost:5173`.

---

## 6. Deploy Edge Functions

Run these from the project root (requires Supabase CLI logged in):

```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
supabase functions deploy cancel-subscription
```

---

## 7. Test the Full Flow (Test Mode)

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

### Test re-subscribe (double-billing guard)
1. Subscribe with one plan → confirm row in DB
2. Subscribe again (same or different plan) without cancelling first
3. In Stripe dashboard → Customers → confirm the **old subscription is cancelled** in Stripe (not just in your DB)
4. Confirm only one active subscription row exists in Supabase

### Test trial coupon
1. Complete a checkout and check the first invoice in Stripe → should show 50% discount applied
2. Check the second renewal → should charge the full price

### Test payment failure (past_due guard)
1. Use Stripe test card `4000 0000 0000 0341` (always fails) to create a subscription
2. Stripe marks it `past_due` and fires `customer.subscription.updated`
3. Confirm the user's `status` in DB stays `active` (not changed to expired)
4. User should still be able to use the app while Stripe retries

---

## 8. Go Live

When ready to accept real payments:

1. In Stripe dashboard, **switch to Live mode** (toggle top-left)
2. Repeat steps 1–5 (products, coupon, webhook, SQL migrations, and secrets in Live mode)
3. In Supabase, update all secrets with the **live** values (live secret key, live webhook secret, live price IDs, live coupon ID)
4. Update `SITE_URL` to your production URL if it isn't already
5. Redeploy the edge functions so they pick up the updated secrets:
   ```bash
   supabase functions deploy create-checkout-session
   supabase functions deploy stripe-webhook
   supabase functions deploy cancel-subscription
   ```

---

## Common Mistakes (from test setup — avoid on prod)

### Secrets

| Mistake | What to do instead |
|---|---|
| Named the `SITE_URL` secret `localhost` | Name must be exactly `SITE_URL` |
| Pasted the **product** ID (`prod_...`) into price secrets | Open the product → scroll to Pricing → copy the `price_...` ID, not the product ID on the right |
| Pasted the coupon **name** (e.g. `FIRSTMONTH50`) into `STRIPE_TRIAL_COUPON_ID` | Go to Product catalogue → Coupons → click the coupon → copy the **Coupon ID** (random string, not the name you typed) |

### Webhook setup

- The new Stripe Workbench UI calls webhooks "event destinations" — it's the same thing
- When creating the endpoint, the API version dropdown only shows current versions — `2024-04-10` is not available. Use `2026-06-24.dahlia`. This only affects the webhook payload format, not your edge function API calls — the fields we use are stable across versions
- Select scope **Your account** (not Connected accounts)

### Deploying edge functions

- Deploy all **3** functions, not just the ones that handle user-facing requests:
  ```bash
  supabase functions deploy create-checkout-session
  supabase functions deploy cancel-subscription
  supabase functions deploy stripe-webhook --no-verify-jwt
  ```
- `stripe-webhook` **must** be deployed with `--no-verify-jwt`. Stripe has no Supabase JWT so the request gets blocked before reaching the function. The webhook is secured by Stripe's signing secret instead — the function verifies it itself. This is correct for production too.
- If you forget to deploy `stripe-webhook`, payments will go through in Stripe but subscriptions will never activate in your DB (webhook fires but gets 404, so 0 deliveries show in Stripe dashboard)

### General

- Do a fresh test purchase after fixing each issue — Stripe will not re-deliver past webhook events automatically (you can manually resend from Stripe → Webhooks → Event deliveries, but easier to just re-test)
- When Stripe checkout redirects back to your app, the subscription may take 1–2 seconds to appear in the DB (webhook is async). The `/subscribe/success` page polls for this — wait for it to confirm before checking the DB

---

## Known Limitations / Future Work

- **`invoice.payment_failed`** is not handled as a webhook event. Stripe retries failed renewals automatically (3–4 times over ~8 days). Access is only revoked when `customer.subscription.deleted` fires after all retries fail. If you want to notify the user earlier (e.g. send an email to update their card), add a handler for this event.
- **Plan upgrades mid-cycle** are not supported — the app creates a new subscription rather than using Stripe's subscription update API. A proper upgrade flow would use `stripe.subscriptions.update()` with proration. For now, users who want to upgrade must cancel and resubscribe.
