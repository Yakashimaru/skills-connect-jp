-- Allow 'both' as a valid user_type
alter table public.profiles
  drop constraint if exists profiles_user_type_check;

alter table public.profiles
  add constraint profiles_user_type_check
  check (user_type in ('provider', 'seeker', 'both'));
