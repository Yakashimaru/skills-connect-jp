-- Enable filtered realtime on messages table.
-- REPLICA IDENTITY FULL is required so Supabase can evaluate the
-- conversation_id column filter on INSERT events.
alter table public.messages replica identity full;

-- Add messages to Supabase's realtime publication so INSERT events are streamed.
alter publication supabase_realtime add table messages;
