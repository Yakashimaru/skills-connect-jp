# Technical Notes

Implementation details, architectural decisions, and challenges encountered building Kaiyui.

---

## Architecture

**Row Level Security**
All Supabase tables are secured with RLS policies. No data is exposed without auth — each policy is scoped to `auth.uid()` so users can only read/write their own data where appropriate.

**Upsert pattern for provider profiles**
Provider profiles are created on first save and updated on subsequent saves via a single `upsert()` call keyed on the user's ID. This avoids needing to check existence before writing.

**Translation maps**
~150 predefined skill, trait, and interest values are stored in English in the DB. Parallel EN/JA/ZH arrays are compiled into `Record<string, string>` lookup maps at module load using a `buildMap()` helper. Each chip label lookup at render time is a single object property access — O(1) rather than O(n) array search.

**Progressive disclosure edit profile**
The edit profile form tracks `addedSections: OptionalSection[]` state. On load, it reads the user's existing profile data and auto-adds sections that already have content — so returning users see their data open, new users see a minimal form. Avoids an overwhelming form while still surfacing all existing data.

**Auth callback**
A single `/auth/callback` route handles both PKCE (`?code=`) and implicit (`#access_token=`) Supabase flows, with a `getSession()` fallback for cases where the hash fragment is stripped during redirect.

---

## Challenges

**Handling both Supabase auth flows in one callback**
Supabase uses PKCE (`?code=`) for new signups and implicit (`#access_token=`) for older flows. Built a single `/auth/callback` component that checks for a code param first, falls back to `onAuthStateChange`, and as a last resort calls `getSession()` to handle cases where the hash fragment is stripped by email proxies (a known Gmail pre-fetch issue).

**Real-time chat deduplication**
Supabase Realtime fires an event for every insert, including ones the client just made optimistically. Solved by inserting a temp message with a local ID, then replacing it with the real DB row on confirmation — so the Realtime event finds a duplicate and skips it, preventing double messages.

**O(1) multilingual chip translation**
The app has ~150 predefined skill, trait, and interest values stored in English in the DB. Rather than searching arrays at render time, parallel EN/JA/ZH arrays are compiled into `Record<string, string>` maps at module load using a `buildMap()` helper. Each chip lookup is a single object property access.

**Progressive disclosure edit profile**
The edit profile form tracks `addedSections: OptionalSection[]` state. On load, it reads the user's existing profile data and auto-adds sections that already have content — so returning users see their data open, new users see a minimal form. Avoids showing an overwhelming form while still surfacing all existing data.

**Auth callback blank page caused by `querySelector`**
The app's `ScrollToTop` component called `document.querySelector(hash)` to scroll to anchor links. When the Supabase auth callback URL contains `#access_token=eyJ...`, React tried to use the entire JWT as a CSS selector and threw a `SyntaxError`, crashing the app before `AuthCallback` could render. Fixed with a `try/catch` around the selector call.
