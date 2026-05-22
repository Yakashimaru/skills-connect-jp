-- Additional profile fields added in the frontend but missing from the DB

alter table public.profiles
  add column if not exists love_language text
    check (love_language in ('words-of-affirmation','acts-of-service','receiving-gifts','quality-time','physical-touch')),
  add column if not exists star_sign text
    check (star_sign in ('aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces')),
  add column if not exists top_traits   text[] not null default '{}',
  add column if not exists top_interests text[] not null default '{}';

alter table public.provider_profiles
  add column if not exists online_rate   integer,
  add column if not exists inperson_rate integer,
  add column if not exists trial_rate    integer,
  add column if not exists top_skills    text[] not null default '{}';
