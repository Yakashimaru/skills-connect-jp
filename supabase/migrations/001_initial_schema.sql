-- =====================
-- EXTENSIONS
-- =====================

create extension if not exists "uuid-ossp";

-- =====================
-- TABLES
-- =====================

create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  user_type text not null check (user_type in ('provider', 'seeker')),
  avatar_url text,
  cover_url text,
  location text,
  bio text,
  mbti text,
  privacy_mode text not null default 'public' check (privacy_mode in ('public', 'hidden', 'anonymous')),
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Provider-specific data (1-to-1 with profiles where user_type = 'provider')
create table public.provider_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  title text,
  skills text[] not null default '{}',
  hourly_rate integer, -- JPY
  session_types text[] not null default '{}',
  rating numeric(3,2) not null default 0,
  review_count integer not null default 0
);

create table public.education (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  degree text not null,
  school text not null,
  year text,
  created_at timestamptz not null default now()
);

create table public.experience (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  role text not null,
  company text not null,
  years text,
  created_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  provider_id uuid references public.profiles(id) on delete restrict not null,
  seeker_id uuid references public.profiles(id) on delete restrict not null,
  session_type text not null,
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 60,
  rate integer not null, -- JPY
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  notes text,
  stripe_payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  reviewer_id uuid references public.profiles(id) on delete cascade not null,
  provider_id uuid references public.profiles(id) on delete cascade not null,
  booking_id uuid references public.bookings(id) on delete set null,
  rating integer not null check (rating >= 1 and rating <= 5),
  text text,
  created_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default uuid_generate_v4(),
  participant1_id uuid references public.profiles(id) on delete cascade not null,
  participant2_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  unique(participant1_id, participant2_id)
);

create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  text text not null,
  attachment_url text,
  created_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default uuid_generate_v4(),
  host_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  image_url text,
  category text not null check (category in ('social', 'sports', 'culture', 'business', 'wellness', 'food')),
  location text not null,
  start_at timestamptz not null,
  max_participants integer,
  participant_count integer not null default 0,
  price integer not null default 0, -- JPY, 0 = free
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_rsvps (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'attending' check (status in ('attending', 'interested', 'cancelled')),
  created_at timestamptz not null default now(),
  unique(event_id, user_id)
);

create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  plan text not null check (plan in ('standard', 'premium', 'elite')),
  amount_monthly integer not null, -- JPY
  status text not null default 'active' check (status in ('active', 'cancelled', 'expired')),
  stripe_subscription_id text,
  stripe_customer_id text,
  started_at timestamptz not null default now(),
  renews_at timestamptz,
  cancelled_at timestamptz
);

create table public.saved_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  saved_profile_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  unique(user_id, saved_profile_id)
);

-- =====================
-- ROW LEVEL SECURITY
-- =====================

alter table public.profiles enable row level security;
alter table public.provider_profiles enable row level security;
alter table public.education enable row level security;
alter table public.experience enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.events enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.subscriptions enable row level security;
alter table public.saved_profiles enable row level security;

-- profiles
create policy "Profiles are viewable based on privacy mode"
  on public.profiles for select
  using (privacy_mode = 'public' or auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- provider_profiles
create policy "Provider profiles are viewable by all"
  on public.provider_profiles for select using (true);

create policy "Providers can insert own provider profile"
  on public.provider_profiles for insert
  with check (auth.uid() = id);

create policy "Providers can update own provider profile"
  on public.provider_profiles for update
  using (auth.uid() = id);

-- education
create policy "Education is viewable by all"
  on public.education for select using (true);

create policy "Users manage own education"
  on public.education for all
  using (auth.uid() = profile_id);

-- experience
create policy "Experience is viewable by all"
  on public.experience for select using (true);

create policy "Users manage own experience"
  on public.experience for all
  using (auth.uid() = profile_id);

-- bookings
create policy "Booking participants can view"
  on public.bookings for select
  using (auth.uid() = provider_id or auth.uid() = seeker_id);

create policy "Seekers can create bookings"
  on public.bookings for insert
  with check (auth.uid() = seeker_id);

create policy "Participants can update booking status"
  on public.bookings for update
  using (auth.uid() = provider_id or auth.uid() = seeker_id);

-- reviews
create policy "Reviews are viewable by all"
  on public.reviews for select using (true);

create policy "Authenticated users can insert reviews"
  on public.reviews for insert
  with check (auth.uid() = reviewer_id);

create policy "Reviewers can update own reviews"
  on public.reviews for update
  using (auth.uid() = reviewer_id);

-- conversations
create policy "Participants can view their conversations"
  on public.conversations for select
  using (auth.uid() = participant1_id or auth.uid() = participant2_id);

create policy "Authenticated users can create conversations"
  on public.conversations for insert
  with check (auth.uid() = participant1_id or auth.uid() = participant2_id);

-- messages
create policy "Participants can view messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.participant1_id = auth.uid() or c.participant2_id = auth.uid())
    )
  );

create policy "Authenticated users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

-- events
create policy "Events are viewable by all"
  on public.events for select using (true);

create policy "Authenticated users can create events"
  on public.events for insert
  with check (auth.uid() = host_id);

create policy "Hosts can update own events"
  on public.events for update
  using (auth.uid() = host_id);

-- event_rsvps
create policy "RSVPs are viewable by all"
  on public.event_rsvps for select using (true);

create policy "Users manage own RSVPs"
  on public.event_rsvps for all
  using (auth.uid() = user_id);

-- subscriptions
create policy "Users view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

-- saved_profiles
create policy "Users manage own saved profiles"
  on public.saved_profiles for all
  using (auth.uid() = user_id);

-- =====================
-- FUNCTIONS & TRIGGERS
-- =====================

-- Auto-create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, user_type)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'New User'),
    coalesce(new.raw_user_meta_data->>'user_type', 'seeker')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.update_updated_at();

create trigger events_updated_at
  before update on public.events
  for each row execute function public.update_updated_at();

-- Recalculate provider rating + review count after a new review
create or replace function public.update_provider_rating()
returns trigger as $$
begin
  update public.provider_profiles
  set
    rating = (select avg(rating) from public.reviews where provider_id = new.provider_id),
    review_count = (select count(*) from public.reviews where provider_id = new.provider_id)
  where id = new.provider_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger after_review_insert
  after insert on public.reviews
  for each row execute function public.update_provider_rating();

-- Keep conversation.last_message_at in sync with new messages
create or replace function public.update_conversation_timestamp()
returns trigger as $$
begin
  update public.conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$ language plpgsql;

create trigger after_message_insert
  after insert on public.messages
  for each row execute function public.update_conversation_timestamp();
