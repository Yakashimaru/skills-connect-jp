alter table public.events drop constraint if exists events_category_check;
alter table public.events add constraint events_category_check
  check (category in ('private', 'business', 'wellness', 'sports', 'networking', 'community'));
