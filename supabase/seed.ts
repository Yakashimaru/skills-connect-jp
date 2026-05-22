/**
 * Seed script — creates test users via Supabase Admin API (GoTrue),
 * then fills in profile data.
 *
 * Usage:
 *   1. Add SUPABASE_SERVICE_ROLE_KEY to .env.local
 *      (Supabase dashboard → Settings → API → service_role key)
 *   2. npx tsx supabase/seed.ts
 *
 * Safe to re-run — existing users are skipped, profile data is upserted.
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const TEST_PASSWORD = 'test1234'

const users = [
  {
    email: 'yuki.tanaka@example.com',
    name: 'Yuki Tanaka',
    user_type: 'provider',
    profile: {
      location: 'Tokyo',
      bio: 'Native English teacher with 8 years experience in Japan. Specialising in business English, TOEIC prep, and daily conversation.',
      verified: true,
    },
    provider_profile: {
      title: 'English Teacher & TOEIC Coach',
      skills: ['English Teaching', 'TOEIC Prep', 'Business English', 'Conversation'],
      hourly_rate: 5000,
      session_types: ['1-on-1 Session', 'Online Call'],
      rating: 4.9,
      review_count: 47,
    },
  },
  {
    email: 'hiroshi.sato@example.com',
    name: 'Hiroshi Sato',
    user_type: 'provider',
    profile: {
      location: 'Osaka',
      bio: 'Business consultant helping foreign professionals navigate Japanese corporate culture. Former Toyota strategy team.',
      verified: true,
    },
    provider_profile: {
      title: 'Japanese Business Culture Advisor',
      skills: ['Business Strategy', 'Cross-cultural Communication', 'Networking', 'HR'],
      hourly_rate: 15000,
      session_types: ['1-on-1 Session', 'Online Call'],
      rating: 4.7,
      review_count: 23,
    },
  },
  {
    email: 'aiko.yamamoto@example.com',
    name: 'Aiko Yamamoto',
    user_type: 'provider',
    profile: {
      location: 'Tokyo',
      bio: 'Certified yoga instructor and wellness coach. Bilingual sessions available in English and Japanese.',
      verified: false,
    },
    provider_profile: {
      title: 'Yoga & Wellness Coach',
      skills: ['Yoga', 'Meditation', 'Mindfulness', 'Wellness Coaching'],
      hourly_rate: 8000,
      session_types: ['1-on-1 Session', 'Online Call', 'Group Meetup'],
      rating: 4.8,
      review_count: 31,
    },
  },
  {
    email: 'kenji.watanabe@example.com',
    name: 'Kenji Watanabe',
    user_type: 'provider',
    profile: {
      location: 'Tokyo',
      bio: 'Senior software engineer at a Tokyo startup. Mentoring foreigners breaking into Japanese tech.',
      verified: true,
    },
    provider_profile: {
      title: 'Tech Mentor & Career Coach',
      skills: ['Software Engineering', 'System Design', 'Career Coaching', 'Japanese Tech'],
      hourly_rate: 12000,
      session_types: ['Online Call'],
      rating: 4.6,
      review_count: 18,
    },
  },
  {
    email: 'alex.johnson@example.com',
    name: 'Alex Johnson',
    user_type: 'seeker',
    profile: {
      location: 'Tokyo',
      bio: 'Canadian living in Tokyo for 2 years. Looking to improve Japanese and connect with the local community.',
      verified: false,
    },
  },
  {
    email: 'sarah.kim@example.com',
    name: 'Sarah Kim',
    user_type: 'seeker',
    profile: {
      location: 'Osaka',
      bio: 'Korean-American marketing professional. Expanding my network in the Kansai region.',
      verified: false,
    },
  },
]

async function seed() {
  console.log('Seeding test users...\n')

  for (const u of users) {
    // 1. Create auth user (GoTrue handles password hashing correctly)
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: u.email,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { name: u.name, user_type: u.user_type },
    })

    if (authErr) {
      if (authErr.message.includes('already been registered')) {
        console.log(`  skip  ${u.email} (already exists)`)
      } else {
        console.error(`  error ${u.email}: ${authErr.message}`)
        continue
      }
    } else {
      console.log(`  created ${u.email}`)
    }

    // 2. Get the user's ID (may have just been created or already existed)
    const { data: { users: existing } } = await supabase.auth.admin.listUsers()
    const userId = existing.find(x => x.email === u.email)?.id
    if (!userId) { console.error(`  could not find ID for ${u.email}`); continue }

    // 3. Upsert profile
    await supabase.from('profiles').upsert({
      id: userId,
      name: u.name,
      user_type: u.user_type,
      ...u.profile,
    })

    // 4. Upsert provider profile if applicable
    if (u.provider_profile) {
      await supabase.from('provider_profiles').upsert({
        id: userId,
        ...u.provider_profile,
      })
    }
  }

  console.log('\nDone.')
}

seed().catch(console.error)
