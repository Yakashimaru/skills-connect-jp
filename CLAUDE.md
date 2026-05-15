# skills-connect-jp

Bilingual EN/JP skills-based social matching platform. React + TypeScript + Vite + Tailwind + Supabase + React Router + i18next.

## Stack decisions
- Auth, DB, Realtime: Supabase (no separate backend — RLS handles security)
- Payments: Stripe via Supabase Edge Functions (not yet implemented)
- Image upload: Cloudflare R2 (not yet implemented)
- Two user types: `provider` (offers services) and `seeker` (books services)

## Intentionally deferred / not started
- Stripe payments — subscription plans UI exists, wiring pending
- Image upload — "Upload photo" button exists, no handler
- `/auth/callback` route — email confirmation redirect shows blank page on localhost (fine for testing, must fix before launch)
- Call buttons (📞 📹) in Chat — decorative only
- Notifications + Payment methods in Dashboard settings — "coming soon"

## Before going to production
- Add `/auth/callback` route: call `supabase.auth.exchangeCodeForSession()` then redirect to /dashboard. Set redirect URL in Supabase dashboard to `{SITE_URL}/auth/callback`. OR disable email confirmation entirely in Supabase dashboard → Authentication → Settings.
- Wire Stripe (Edge Functions)
- Wire image upload (Cloudflare R2)
