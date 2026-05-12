DO $$ BEGIN

INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data, raw_app_meta_data, aud, role)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'yuki.tanaka@example.com',    crypt('test1234', gen_salt('bf')), now(), now(), now(), '{"name":"Yuki Tanaka","user_type":"provider"}'::jsonb,    '{"provider":"email","providers":["email"]}'::jsonb, 'authenticated', 'authenticated'),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'hiroshi.sato@example.com',   crypt('test1234', gen_salt('bf')), now(), now(), now(), '{"name":"Hiroshi Sato","user_type":"provider"}'::jsonb,   '{"provider":"email","providers":["email"]}'::jsonb, 'authenticated', 'authenticated'),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'aiko.yamamoto@example.com',  crypt('test1234', gen_salt('bf')), now(), now(), now(), '{"name":"Aiko Yamamoto","user_type":"provider"}'::jsonb,  '{"provider":"email","providers":["email"]}'::jsonb, 'authenticated', 'authenticated'),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'kenji.watanabe@example.com', crypt('test1234', gen_salt('bf')), now(), now(), now(), '{"name":"Kenji Watanabe","user_type":"provider"}'::jsonb, '{"provider":"email","providers":["email"]}'::jsonb, 'authenticated', 'authenticated'),
  ('bbbbbbbb-0000-0000-0000-000000000001', 'alex.johnson@example.com',   crypt('test1234', gen_salt('bf')), now(), now(), now(), '{"name":"Alex Johnson","user_type":"seeker"}'::jsonb,     '{"provider":"email","providers":["email"]}'::jsonb, 'authenticated', 'authenticated'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'sarah.kim@example.com',      crypt('test1234', gen_salt('bf')), now(), now(), now(), '{"name":"Sarah Kim","user_type":"seeker"}'::jsonb,        '{"provider":"email","providers":["email"]}'::jsonb, 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

UPDATE public.profiles SET location='Tokyo, Japan',   bio='Native English teacher with 8 years experience in Japan. Specialising in business English, TOEIC prep, and daily conversation.', mbti='ENFJ', verified=true  WHERE id='aaaaaaaa-0000-0000-0000-000000000001';
UPDATE public.profiles SET location='Osaka, Japan',   bio='Business consultant helping foreign professionals navigate Japanese corporate culture. Former Toyota strategy team.',               mbti='ENTJ', verified=true  WHERE id='aaaaaaaa-0000-0000-0000-000000000002';
UPDATE public.profiles SET location='Tokyo, Japan',   bio='Certified yoga instructor and wellness coach. Bilingual sessions available in English and Japanese.',                             mbti='INFP', verified=false WHERE id='aaaaaaaa-0000-0000-0000-000000000003';
UPDATE public.profiles SET location='Fukuoka, Japan', bio='Senior software engineer at a Tokyo startup. Mentoring foreigners breaking into Japanese tech.',                                 mbti='INTP', verified=true  WHERE id='aaaaaaaa-0000-0000-0000-000000000004';
UPDATE public.profiles SET location='Tokyo, Japan',   bio='Canadian living in Tokyo for 2 years. Looking to improve Japanese and connect with the local community.',                        mbti='ENFP'                WHERE id='bbbbbbbb-0000-0000-0000-000000000001';
UPDATE public.profiles SET location='Osaka, Japan',   bio='Korean-American marketing professional. Expanding my network in the Kansai region.',                                            mbti='ESTJ'                WHERE id='bbbbbbbb-0000-0000-0000-000000000002';

INSERT INTO public.provider_profiles (id, title, skills, hourly_rate, session_types, rating, review_count) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'English Teacher & TOEIC Coach',    ARRAY['English Teaching','TOEIC Prep','Business English','Conversation'],       5000,  ARRAY['online','in-person'],        4.9, 47),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'Japanese Business Culture Advisor', ARRAY['Business Strategy','Cross-cultural Communication','Networking','HR'],    15000, ARRAY['online','in-person'],        4.7, 23),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'Yoga & Wellness Coach',             ARRAY['Yoga','Meditation','Mindfulness','Wellness Coaching'],                    8000,  ARRAY['online','in-person','group'],4.8, 31),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'Tech Mentor & Career Coach',        ARRAY['Software Engineering','System Design','Career Coaching','Japanese Tech'],12000, ARRAY['online'],                    4.6, 18)
ON CONFLICT (id) DO NOTHING;

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
  (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'online',    now() + interval '3 days',  60, 5000,  'confirmed'),
  (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'in-person', now() - interval '10 days', 60, 5000,  'completed'),
  (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000002', 'online',    now() + interval '7 days',  90, 15000, 'pending'),
  (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000004', 'bbbbbbbb-0000-0000-0000-000000000001', 'online',    now() - interval '20 days', 60, 12000, 'completed');

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
