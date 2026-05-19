-- Add personality, interests, qualifications, achievements to profiles (available to all users)
alter table public.profiles
  add column if not exists personality_traits text[]  not null default '{}',
  add column if not exists interests          text[]  not null default '{}',
  add column if not exists personality_insights text,
  add column if not exists qualifications     jsonb   not null default '[]',
  add column if not exists achievements       text[]  not null default '{}';

-- Add schedule/availability to provider_profiles (provider-only)
alter table public.provider_profiles
  add column if not exists availability jsonb not null default '{}';
