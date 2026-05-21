alter table public.profiles
  add column if not exists vacation_mode boolean not null default false;
