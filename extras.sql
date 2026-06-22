-- ============================================================
-- extras.sql — apply AFTER schema.sql on any new Supabase project
--
-- These are things that pg_dump cannot capture:
--   1. Triggers on auth.users (auth schema is excluded from dump)
--   2. Storage bucket creation (bucket data lives outside public schema)
--   3. Constraint fixes that diverged from the old prod DB
-- ============================================================


-- ------------------------------------------------------------
-- 1. Auth trigger — auto-create profile row on signup
--    handle_new_user() is already in schema.sql; this just
--    wires it to auth.users which the dump cannot touch.
-- ------------------------------------------------------------
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ------------------------------------------------------------
-- 2. Storage — avatars bucket + policies
-- ------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Avatars are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = split_part(name, '/', 1)
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = split_part(name, '/', 1)
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = split_part(name, '/', 1)
  );


-- ------------------------------------------------------------
-- 3. Fix events category constraint
--    Old prod had: social, sports, culture, business, wellness, food
--    App now uses: private, business, wellness, sports, networking, community
-- ------------------------------------------------------------
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_category_check;
ALTER TABLE public.events ADD CONSTRAINT events_category_check
  CHECK (category IN (
    'private', 'business', 'wellness', 'sports', 'networking', 'community'
  ));


-- ------------------------------------------------------------
-- 4. New profile columns for event preferences, notifications,
--    and phone number (added for profile-and-discovery-updates)
-- ------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone                    text,
  ADD COLUMN IF NOT EXISTS event_preferences        text[]   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS notification_preferences jsonb    DEFAULT '{}';


-- ------------------------------------------------------------
-- 5. Drop the INSERT RLS policy on subscriptions.
--    This policy allowed any authenticated user to insert a row
--    directly and grant themselves a free active subscription.
--    Subscriptions must only be created by the webhook via the
--    service role key, which bypasses RLS entirely.
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;


-- ------------------------------------------------------------
-- 6. Stripe idempotency — unique constraint on subscription ID
--    Prevents duplicate rows if Stripe retries a webhook event.
-- ------------------------------------------------------------
ALTER TABLE public.subscriptions
  ADD CONSTRAINT IF NOT EXISTS subscriptions_stripe_subscription_id_key
  UNIQUE (stripe_subscription_id);


-- ------------------------------------------------------------
-- 7. Stripe webhook — atomic cancel + activate subscription
--    Runs both operations in one transaction so a partial failure
--    cannot leave the user with no active subscription.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.activate_subscription(
  p_user_id          uuid,
  p_plan             text,
  p_amount_monthly   integer,
  p_stripe_sub_id    text,
  p_stripe_cust_id   text,
  p_renews_at        timestamptz
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Cancel any existing active subscription for this user
  UPDATE public.subscriptions
     SET status       = 'cancelled',
         cancelled_at = now()
   WHERE user_id = p_user_id
     AND status  = 'active';

  -- Insert the new active subscription
  INSERT INTO public.subscriptions
    (user_id, plan, amount_monthly, status,
     stripe_subscription_id, stripe_customer_id, renews_at)
  VALUES
    (p_user_id, p_plan, p_amount_monthly, 'active',
     p_stripe_sub_id, p_stripe_cust_id, p_renews_at);
END;
$$;
