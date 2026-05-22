-- NOTE: Create test users manually via Supabase Dashboard → Authentication → Users
-- with "Auto Confirm User" checked. The handle_new_user trigger will create
-- their profile rows automatically. Then run this file to fill in the data.
--
-- Test accounts (password: test1234):
--   yuki.tanaka@example.com    — Provider
--   hiroshi.sato@example.com   — Provider
--   aiko.yamamoto@example.com  — Provider
--   kenji.watanabe@example.com — Provider
--   alex.johnson@example.com   — Seeker
--   sarah.kim@example.com      — Seeker

DO $$ BEGIN

UPDATE public.profiles SET name='Yuki Tanaka',    user_type='provider', location='Tokyo', verified=true,  bio='Native English teacher with 8 years experience in Japan. Specialising in business English, TOEIC prep, and daily conversation.' WHERE id=(SELECT id FROM auth.users WHERE email='yuki.tanaka@example.com');
UPDATE public.profiles SET name='Hiroshi Sato',   user_type='provider', location='Osaka', verified=true,  bio='Business consultant helping foreign professionals navigate Japanese corporate culture. Former Toyota strategy team.'              WHERE id=(SELECT id FROM auth.users WHERE email='hiroshi.sato@example.com');
UPDATE public.profiles SET name='Aiko Yamamoto',  user_type='provider', location='Tokyo', verified=false, bio='Certified yoga instructor and wellness coach. Bilingual sessions available in English and Japanese.'                            WHERE id=(SELECT id FROM auth.users WHERE email='aiko.yamamoto@example.com');
UPDATE public.profiles SET name='Kenji Watanabe', user_type='provider', location='Tokyo', verified=true,  bio='Senior software engineer at a Tokyo startup. Mentoring foreigners breaking into Japanese tech.'                               WHERE id=(SELECT id FROM auth.users WHERE email='kenji.watanabe@example.com');
UPDATE public.profiles SET name='Alex Johnson',   user_type='seeker',   location='Tokyo', bio='Canadian living in Tokyo for 2 years. Looking to improve Japanese and connect with the local community.'                                      WHERE id=(SELECT id FROM auth.users WHERE email='alex.johnson@example.com');
UPDATE public.profiles SET name='Sarah Kim',      user_type='seeker',   location='Osaka', bio='Korean-American marketing professional. Expanding my network in the Kansai region.'                                                          WHERE id=(SELECT id FROM auth.users WHERE email='sarah.kim@example.com');

INSERT INTO public.provider_profiles (id, title, skills, hourly_rate, session_types, rating, review_count)
SELECT id, 'English Teacher & TOEIC Coach', ARRAY['English Teaching','TOEIC Prep','Business English','Conversation'], 5000, ARRAY['1-on-1 Session','Online Call'], 4.9, 47
FROM auth.users WHERE email='yuki.tanaka@example.com'
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, skills=EXCLUDED.skills, hourly_rate=EXCLUDED.hourly_rate, session_types=EXCLUDED.session_types, rating=EXCLUDED.rating, review_count=EXCLUDED.review_count;

INSERT INTO public.provider_profiles (id, title, skills, hourly_rate, session_types, rating, review_count)
SELECT id, 'Japanese Business Culture Advisor', ARRAY['Business Strategy','Cross-cultural Communication','Networking','HR'], 15000, ARRAY['1-on-1 Session','Online Call'], 4.7, 23
FROM auth.users WHERE email='hiroshi.sato@example.com'
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, skills=EXCLUDED.skills, hourly_rate=EXCLUDED.hourly_rate, session_types=EXCLUDED.session_types, rating=EXCLUDED.rating, review_count=EXCLUDED.review_count;

INSERT INTO public.provider_profiles (id, title, skills, hourly_rate, session_types, rating, review_count)
SELECT id, 'Yoga & Wellness Coach', ARRAY['Yoga','Meditation','Mindfulness','Wellness Coaching'], 8000, ARRAY['1-on-1 Session','Online Call','Group Meetup'], 4.8, 31
FROM auth.users WHERE email='aiko.yamamoto@example.com'
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, skills=EXCLUDED.skills, hourly_rate=EXCLUDED.hourly_rate, session_types=EXCLUDED.session_types, rating=EXCLUDED.rating, review_count=EXCLUDED.review_count;

INSERT INTO public.provider_profiles (id, title, skills, hourly_rate, session_types, rating, review_count)
SELECT id, 'Tech Mentor & Career Coach', ARRAY['Software Engineering','System Design','Career Coaching','Japanese Tech'], 12000, ARRAY['Online Call'], 4.6, 18
FROM auth.users WHERE email='kenji.watanabe@example.com'
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, skills=EXCLUDED.skills, hourly_rate=EXCLUDED.hourly_rate, session_types=EXCLUDED.session_types, rating=EXCLUDED.rating, review_count=EXCLUDED.review_count;

INSERT INTO public.education (profile_id, degree, school, year) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'BA English Literature',         'University of Edinburgh',       '2015'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'CELTA Certification',           'Cambridge English',             '2016'),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'MBA Business Administration',   'Waseda University',             '2012'),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'BSc Economics',                 'Keio University',               '2010'),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'RYT-200 Yoga Teacher Training', 'Yoga Alliance Japan',           '2019'),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'BSc Computer Science',          'Tokyo Institute of Technology', '2014');

INSERT INTO public.experience (profile_id, role, company, years) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'English Instructor',           'Berlitz Japan',            '2016–2020'),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Freelance English Tutor',      'Self-employed',            '2020–present'),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'Strategy Consultant',          'Toyota Motor Corporation', '2012–2018'),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'Independent Business Advisor', 'Self-employed',            '2018–present'),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'Yoga Instructor',              'Lava Yoga Tokyo',          '2019–2022'),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'Wellness Coach',               'Self-employed',            '2022–present'),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'Software Engineer',            'Mercari',                  '2014–2021'),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'Senior Engineer & Mentor',     'LayerX',                   '2021–present');

INSERT INTO public.bookings (id, provider_id, seeker_id, session_type, scheduled_at, duration_minutes, rate, status) VALUES
  (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Online Call',     now() + interval '3 days',  60, 5000,  'confirmed'),
  (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '1-on-1 Session',  now() - interval '10 days', 60, 5000,  'completed'),
  (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000002', 'Online Call',     now() + interval '7 days',  90, 15000, 'pending'),
  (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000004', 'bbbbbbbb-0000-0000-0000-000000000001', 'Online Call',     now() - interval '20 days', 60, 12000, 'completed');

INSERT INTO public.reviews (reviewer_id, provider_id, rating, text) VALUES
  ('bbbbbbbb-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 5, 'Yuki is an amazing teacher. My TOEIC score jumped 80 points after just 6 sessions!'),
  ('bbbbbbbb-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000004', 4, 'Kenji gave me a realistic picture of the Japanese tech scene and helped with my resume. Very practical advice.'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000002', 5, 'Hiroshi saved me from making huge cultural mistakes in my first Japanese job. Invaluable.');

INSERT INTO public.events (host_id, title, description, category, location, start_at, max_participants, participant_count, price) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'English Conversation Mixer',          'Casual English practice session for all levels. Meet expats and locals at a relaxed izakaya setting.', 'social',   'Shinjuku, Tokyo',   now() + interval '5 days',  20,  8,  1000),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'Japanese Business Networking Night',  'Connect with professionals working across Japan. Business card exchange, drinks, and industry talks.', 'business', 'Umeda, Osaka',      now() + interval '12 days', 40,  15, 2000),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'Morning Yoga in Yoyogi Park',         'Outdoor yoga session for all levels. Bring your mat! Free to join, donations welcome.',              'wellness', 'Yoyogi Park, Tokyo',now() + interval '2 days',  30,  11, 0),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'Tech Talk: Breaking into Japan Tech',  'Panel discussion on how to land a software job in Japan as a foreigner. Q&A included.',            'business', 'Online (Zoom)',      now() + interval '9 days',  100, 43, 500);

INSERT INTO public.subscriptions (user_id, plan, amount_monthly, status, renews_at) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'premium',  10000, 'active', now() + interval '30 days'),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'elite',    50000, 'active', now() + interval '30 days'),
  ('bbbbbbbb-0000-0000-0000-000000000001', 'standard', 5000,  'active', now() + interval '30 days');

END $$;
