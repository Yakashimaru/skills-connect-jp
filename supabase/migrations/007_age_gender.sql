alter table public.profiles
  add column if not exists birth_year integer,
  add column if not exists gender     text check (gender in ('male', 'female', 'non-binary', 'prefer-not-to-say'));
