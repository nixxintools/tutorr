create extension if not exists pgcrypto;

-- Table: profiles
create table if not exists public.profiles (
  id uuid references auth.users(id) primary key,
  role text check (role in ('student', 'teacher', 'parent')) default 'student',
  full_name text,
  grade_level text default 'middle_school',
  subscription_tier text check (subscription_tier in ('free', 'pro')) default 'free',
  created_at timestamptz default now()
);

-- Table: conversations
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  subject text check (subject in ('math', 'reading', 'science')),
  title text,
  created_at timestamptz default now()
);

-- Table: messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  role text check (role in ('user', 'assistant')),
  content text not null,
  is_flagged boolean default false,
  created_at timestamptz default now()
);

-- Table: progress
create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  subject text,
  session_count int default 0,
  messages_count int default 0,
  last_active timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, subject)
);

-- Table: safety_flags
create table if not exists public.safety_flags (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references public.messages(id),
  reason text,
  reviewed boolean default false,
  created_at timestamptz default now()
);

-- RLS on all tables
alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.progress enable row level security;
alter table public.safety_flags enable row level security;

-- Policies
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "conversations_all_own" on public.conversations;
create policy "conversations_all_own"
  on public.conversations
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "messages_all_by_conversation_owner" on public.messages;
create policy "messages_all_by_conversation_owner"
  on public.messages
  for all
  using (
    conversation_id in (
      select id from public.conversations where user_id = auth.uid()
    )
  )
  with check (
    conversation_id in (
      select id from public.conversations where user_id = auth.uid()
    )
  );

drop policy if exists "progress_select_own" on public.progress;
create policy "progress_select_own"
  on public.progress
  for select
  using (auth.uid() = user_id);

drop policy if exists "progress_insert_own" on public.progress;
create policy "progress_insert_own"
  on public.progress
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "progress_update_own" on public.progress;
create policy "progress_update_own"
  on public.progress
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Trigger function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RPC function
create or replace function public.upsert_progress(p_user_id uuid, p_subject text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.progress (user_id, subject, session_count, last_active)
  values (p_user_id, p_subject, 1, now())
  on conflict (user_id, subject)
  do update
    set session_count = public.progress.session_count + 1,
        last_active = now();
end;
$$;
