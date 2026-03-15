# skills-connect-app

A skills-based social matching platform (EN/JP) where users connect through personality, interests, and skill exchange — not just looks or financial status.

## Concept

A hybrid platform combining social networking, companionship, and skill exchange. Users connect based on personality, interests, skills, companionship needs, and shared experiences. Enables both social connection and paid services.

## Target Market

Japan and English-speaking markets (EN/JP).

## Stack

- **Frontend:** React + TypeScript + Tailwind CSS + React Router
- **Backend:** Node.js + Supabase (auth, database, real-time chat, storage)
- **Payments:** Stripe (subscriptions + session commission)

## Screens

1. **Home** — search bar, greeting, recommended user cards
2. **Discover** — browse and filter profiles by skill, location, price, gender
3. **Profile** — full user profile with skills, reviews, booking options
4. **Chat** — messaging with booking shortcut, voice/video icons
5. **Meetups** — map/list view of events with RSVP
6. **Dashboard** — user control center (sessions, bookings, earnings, settings)

## User Types

- **Service Providers** — offer skills, companionship, coaching, mentorship, etc.
- **Service Seekers** — browse and book sessions with providers

## Dual Profile System

Each user has two layers:
1. **Social layer** — who they are (personality, interests, hobbies, MBTI, etc.)
2. **Skill/Service layer** — what value they offer or are looking for

## Monetization

- Session commission (10–20% per booking)
- Subscription tiers for seekers (Standard ¥5,000 / Premium ¥10,000 / Elite ¥50,000 per month)
- Profile boosts for providers
- Virtual gifts/tokens
- Event tickets

## Development Approach

- Solo developer
- Frontend-first (web app, not mobile)
- MVP: Home, Discover, Profile, Chat, Meetups screens
