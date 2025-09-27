-- TogetherCal Supabase schema
create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','member','child')),
  color_hex text not null default '#5E6AD2',
  emoji text not null default '😊',
  status text not null default 'active' check (status in ('active','invited','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.member_devices (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  push_token text,
  device_type text,
  notifications jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.member_links (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  provider text not null check (provider in ('google','outlook','caldav')),
  provider_uid text not null,
  access_token text,
  refresh_token text,
  scopes text[] default '{}',
  last_synced_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.calendars (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  provider text check (provider in ('google','outlook','caldav','internal')) default 'internal',
  provider_id text,
  name text not null,
  emoji text,
  color_hex text not null,
  visibility text not null default 'family' check (visibility in ('family','private','busy-only')),
  sync_mode text not null default 'read' check (sync_mode in ('read','write')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  calendar_id uuid not null references public.calendars(id) on delete cascade,
  creator_id uuid not null references public.members(id) on delete cascade,
  title text not null,
  description text,
  location text,
  category text,
  privacy_mode text not null default 'family' check (privacy_mode in ('family','private','busy-only')),
  start_at timestamptz not null,
  end_at timestamptz not null,
  all_day boolean default false,
  status text not null default 'confirmed' check (status in ('confirmed','cancelled')),
  approval_state text not null default 'approved' check (approval_state in ('pending','approved','rejected')),
  is_busy_only boolean default false,
  source text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.event_attendees (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  status text default 'accepted' check (status in ('accepted','declined','pending')),
  rsvp_state text default 'accepted',
  role text default 'participant',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.event_reminders (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  reminder_type text not null default 'push' check (reminder_type in ('push','email')),
  offset_minutes integer not null default 30,
  delivered_at timestamptz,
  channel text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  payload jsonb not null,
  channel text not null,
  status text not null default 'queued' check (status in ('queued','sent','failed','read')),
  delivered_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  actor_member_id uuid references public.members(id),
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);

alter table public.families enable row level security;
alter table public.members enable row level security;
alter table public.member_devices enable row level security;
alter table public.member_links enable row level security;
alter table public.calendars enable row level security;
alter table public.events enable row level security;
alter table public.event_attendees enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy "Members can view their family" on public.families
  for select using (exists (
    select 1 from public.members m
    where m.family_id = families.id and m.user_id = auth.uid()
  ));

create policy "Owners and admins manage families" on public.families
  for all using (exists (
    select 1 from public.members m
    where m.family_id = families.id and m.user_id = auth.uid() and m.role in ('owner','admin')
  ));

create policy "Members manage themselves" on public.members
  for all using (
    user_id = auth.uid()
  ) with check (
    user_id = auth.uid()
  );

create policy "Members read same family" on public.members
  for select using (exists (
    select 1 from public.members m
    where m.family_id = members.family_id and m.user_id = auth.uid()
  ));

create policy "Family scope calendars" on public.calendars
  for all using (exists (
    select 1 from public.members m
    where m.family_id = calendars.family_id and m.user_id = auth.uid()
  ));

create policy "Event visibility" on public.events
  for select using (exists (
    select 1 from public.members m
    where m.id = events.creator_id and m.user_id = auth.uid()
  ) or exists (
    select 1 from public.event_attendees ea
    join public.members m2 on m2.id = ea.member_id
    where ea.event_id = events.id and m2.user_id = auth.uid()
  ));

create policy "Event insert restricted" on public.events
  for insert with check (exists (
    select 1 from public.members m
    join public.calendars c on c.family_id = m.family_id
    where c.id = events.calendar_id and m.user_id = auth.uid()
  ));

create policy "Event update restricted" on public.events
  for update using (exists (
    select 1 from public.members m
    where m.id = events.creator_id and m.user_id = auth.uid() and m.role in ('owner','admin','member')
  ));

create policy "Attendees only family" on public.event_attendees
  for all using (exists (
    select 1 from public.members m
    where m.id = event_attendees.member_id and m.user_id = auth.uid()
  ));

create policy "Member devices self" on public.member_devices
  for all using (exists (
    select 1 from public.members m
    where m.id = member_devices.member_id and m.user_id = auth.uid()
  ));

create policy "Notifications per member" on public.notifications
  for all using (exists (
    select 1 from public.members m
    where m.id = notifications.member_id and m.user_id = auth.uid()
  ));

create policy "Audit logs read" on public.audit_logs
  for select using (exists (
    select 1 from public.members m
    where m.family_id = audit_logs.family_id and m.user_id = auth.uid()
  ));
