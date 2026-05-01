create table contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text not null,
  message     text not null,
  created_at  timestamptz not null default now()
);

alter table contact_messages enable row level security;

-- Anyone (including unauthenticated) can insert
create policy "Anyone can submit contact form"
  on contact_messages for insert
  with check (true);

-- Only service role can read (admin dashboard access only)
create policy "Service role reads contact messages"
  on contact_messages for select
  using (false);
