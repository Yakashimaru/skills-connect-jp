# Kaiyui

> Japan's skills and social matching platform — connecting people through personality, skills, and shared experiences.

**🌐 Live:** [www.kaiyui.com](https://www.kaiyui.com)

![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)
![i18n](https://img.shields.io/badge/i18n-EN_|_JA_|_ZH-blue?style=flat)

---

## Overview

Kaiyui is a full-stack web application that lets users discover, connect with, and book sessions with service providers across Japan. It supports both professional skills (coaching, tutoring, language lessons) and social experiences (dining partners, activity partners, travel companions).

The platform is fully multilingual — English, Japanese, and Chinese — and targets the Japanese market with localised city names, skill labels, and UI copy across all three languages.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | ![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) |
| Styling | ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) |
| Routing | ![React Router](https://img.shields.io/badge/React_Router_v6-CA4245?style=flat&logo=react-router&logoColor=white) |
| Backend | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white) PostgreSQL + PostgREST |
| Auth | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white) Auth — PKCE + implicit flow |
| Realtime | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white) Realtime — chat subscriptions |
| Storage | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white) Storage — avatars, gallery |
| i18n | ![i18next](https://img.shields.io/badge/i18next-26A69A?style=flat&logo=i18next&logoColor=white) EN / JA / ZH |
| Email | ![Resend](https://img.shields.io/badge/Resend-000000?style=flat&logo=mail.ru&logoColor=white) Custom SMTP |
| Deployment | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white) CD from `master` |

---

## Key Features

### User Profiles
- Dual-layer profiles: **Skills** (professional offerings) and **Social** (personality, interests, experiences)
- Progressive disclosure edit form — only relevant sections shown, optional ones added on demand
- Gallery photo uploads (up to 5), cover photo, last active timestamp
- Personality traits, MBTI, star sign, interests — all translated across EN/JA/ZH

### Discovery
- Filter by skill category, location (all Japan prefectures), price range, age, gender, verified status
- Skill chips and city names translated to Japanese and Chinese
- Separate Skills and Social browse pages

### Bookings & Sessions
- Book sessions with type (1-on-1, Group, Online, Social), date, time, duration
- Pricing: online rate, in-person rate, trial rate
- Session availability schedule per day with time slots

### Subscriptions & Payment Gate
- Seekers require an active subscription to chat or book sessions
- Events exclusive to members
- Subscription plans: Standard / Premium / Elite
- Stripe integration planned

### Chat
- Real-time messaging via Supabase Realtime
- Conversation list with relative timestamps

### Events
- Browse and RSVP to community events
- Category filters, map view (planned)
- Member-only access

### Auth
- Email/password signup with confirmation flow
- Custom branded confirmation screen at `/auth/callback`
- Handles both PKCE and implicit Supabase auth flows
- Custom SMTP via Resend (`noreply@kaiyui.com`)

### Internationalisation
- Full EN / JA / ZH translations across all pages, components, and form fields
- Predefined skill, trait, and interest chips translated via lookup maps
- Location names (all Japan cities/prefectures) translated to JA and ZH
- Language switcher dropdown in navbar

---

## Screenshots

![Home](https://github.com/user-attachments/assets/374e86b8-1402-4502-b258-c8ed6260b2bb)

---

For implementation details and architectural decisions, see [TECHNICAL.md](TECHNICAL.md).

---

## Project Structure

```
src/
├── components/       Navbar, ProviderCard, SubscriptionPlans, CollapsibleSection
├── pages/            Home, Skills, Social, Profile, EditProfile, Chat, Meetups, Dashboard
├── lib/              Supabase client, DB helpers (profiles, bookings, events...), constants, types
├── locales/          en/ ja/ zh/ translation JSON files
├── context/          AuthContext (session, cached profile, last_online tracking)
└── i18n.ts           i18next setup with EN/JA/ZH resources
```

---

## Local Development

```bash
npm install
npm run dev
```

Create `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

