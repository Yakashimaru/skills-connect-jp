# Skills Connect JP — Project Guide

## What is this app?

Skills Connect JP is a platform that connects foreigners living in Japan with local professionals (called "providers") who can help them with things like English teaching, business mentoring, yoga coaching, and tech mentorship. Users can book sessions, chat, attend meetup events, and subscribe to plans.

---

## Two types of users

- **Provider** — someone offering a skill or service (e.g. English teacher, business consultant)
- **Seeker** — someone looking for help or a connection

---

## How to start the app locally

1. Open the terminal in this folder
2. Run: `npm run dev`
3. Open your browser and go to: `http://localhost:3001`

The app will not work properly without the Supabase connection set up (see below).

---

## The database (Supabase)

All user data, bookings, messages, and events are stored in Supabase — think of it as the app's online database.

**Credentials are stored in `.env.local`** — this file is secret and must never be shared or committed to Git.

```
VITE_SUPABASE_URL=https://hyjpsrizycuscbpoujar.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_Bu4o4cbjBxmkOLR70z0MfA_8cb26Fd-
```

To set up the database from scratch, go to [supabase.com](https://supabase.com) → your project → SQL Editor, then run these files in order:
1. `supabase/migrations/001_initial_schema.sql` — creates all the tables
2. `supabase/migrations/002_contact_messages.sql` — creates the contact form table
3. `supabase/migrations/003_sample_data.sql` — fills in test accounts and data

---

## Test accounts (password: `test1234`)

| Email | Role |
|---|---|
| yuki.tanaka@example.com | Provider — English Teacher |
| hiroshi.sato@example.com | Provider — Business Advisor |
| aiko.yamamoto@example.com | Provider — Yoga Coach |
| kenji.watanabe@example.com | Provider — Tech Mentor |
| alex.johnson@example.com | Seeker |
| sarah.kim@example.com | Seeker |

---

## Pages in the app

| Page | What it does |
|---|---|
| `/` | Homepage |
| `/discover` | Browse provider profiles |
| `/profile/:id` | View a provider's full profile |
| `/meetups` | Browse upcoming events |
| `/chat` | Messaging between users (login required) |
| `/dashboard` | User's personal dashboard with bookings, saved profiles, and settings |
| `/edit-profile` | Edit your own profile |
| `/login` | Log in |
| `/signup` | Create a new account |
| `/contact` | Contact form |

---

## Key folders

| Folder / File | What it contains |
|---|---|
| `src/pages/` | Every page of the app |
| `src/components/` | Reusable pieces of the UI (navbar, cards, etc.) |
| `src/lib/` | Code that talks to the database (auth, bookings, messages, etc.) |
| `src/context/AuthContext.tsx` | Keeps track of who is logged in across the whole app |
| `supabase/migrations/` | SQL files that set up and populate the database |
| `.env.local` | Secret keys — never share this file |

---

## Things not yet finished

- **Payments (Stripe)** — the subscription plans UI exists but payments are not wired up yet
- **Notifications** — shows "coming soon" in the settings menu
- **Booking flow** — users can see bookings but cannot create one through the UI yet

---

## Common tasks for Claude

- "Fix the bug where X happens" — describe what you see and what you expected
- "Add a new page for X" — describe what the page should show and who can see it
- "The Y button does nothing" — Claude will find the button in the code and wire it up
- "Add X to the database" — Claude will update the SQL migration files
- "The design looks wrong on mobile" — describe what looks off and Claude will fix the layout

---

## Tech used (plain English)

| Tool | What it does |
|---|---|
| React | Builds the UI — what you see on screen |
| TypeScript | Like JavaScript but with extra checks to catch mistakes |
| Vite | Runs the app locally during development |
| Tailwind CSS | Handles the styling and layout |
| Supabase | The database and login system |
| React Router | Controls which page shows up at which URL |
| i18next | Handles English/Japanese language switching |
