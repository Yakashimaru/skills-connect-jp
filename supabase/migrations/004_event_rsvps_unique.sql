-- Unique constraint so upsert works correctly
alter table public.event_rsvps
  add constraint event_rsvps_event_user_unique unique (event_id, user_id);

-- Keep events.participant_count in sync with event_rsvps
create or replace function sync_participant_count()
returns trigger language plpgsql security definer as $$
begin
  update public.events
  set participant_count = (
    select count(*) from public.event_rsvps
    where event_id = coalesce(new.event_id, old.event_id)
      and status = 'attending'
  )
  where id = coalesce(new.event_id, old.event_id);
  return coalesce(new, old);
end;
$$;

create trigger trg_sync_participant_count
  after insert or update or delete on public.event_rsvps
  for each row execute function sync_participant_count();
