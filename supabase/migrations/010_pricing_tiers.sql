alter table public.provider_profiles
  add column if not exists online_rate   integer,
  add column if not exists inperson_rate integer,
  add column if not exists trial_rate    integer;
