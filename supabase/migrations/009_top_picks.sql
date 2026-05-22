alter table public.profiles
  add column if not exists top_traits    text[] not null default '{}',
  add column if not exists top_interests text[] not null default '{}';

alter table public.provider_profiles
  add column if not exists top_skills text[] not null default '{}';
