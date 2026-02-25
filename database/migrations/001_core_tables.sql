-- ============================================================
-- Elev8 — Migration 001: Core Tables
-- Run in: Supabase Dashboard > SQL Editor
-- ============================================================

-- --------------------------------------------------------
-- 1. PROFILES
-- --------------------------------------------------------
create table profiles (
  id            uuid primary key,  -- mirrors auth.users.id
  username      text not null unique,
  display_name  text not null,
  bio           text,
  avatar_url    text,
  credit_balance int not null default 0,
  rac_score     numeric not null default 0,
  onboarding_stage text not null default 'subsidized',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table profiles enable row level security;

-- Anyone can read profiles
create policy "Profiles are publicly readable"
  on profiles for select
  using (true);

-- Users can only update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Users can insert their own profile (signup)
create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);


-- --------------------------------------------------------
-- 2. COMMUNITIES
-- --------------------------------------------------------
create table communities (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  icon_url    text,
  created_by  uuid not null references profiles(id),
  is_private  boolean not null default false,
  is_nsfw     boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table communities enable row level security;

-- Anyone can read communities
create policy "Communities are publicly readable"
  on communities for select
  using (true);

-- Authenticated users can create communities
create policy "Authenticated users can create communities"
  on communities for insert
  with check (auth.uid() = created_by);


-- --------------------------------------------------------
-- 3. THREADS
-- --------------------------------------------------------
create table threads (
  id                    uuid primary key default gen_random_uuid(),
  community_id          uuid not null references communities(id) on delete cascade,
  author_id             uuid references profiles(id) on delete set null,
  title                 text not null,
  body                  text,
  thread_type           text not null default 'question',
  question_type         text default null,
  question_type_locked  boolean not null default false,
  status                text not null default 'open',
  bounty_amount         int not null default 0,
  score                 int not null default 0,
  answer_count          int not null default 0,
  is_locked             boolean not null default false,
  is_pinned             boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  deleted_at            timestamptz
);

alter table threads enable row level security;

-- Anyone can read threads (that aren't soft-deleted)
create policy "Threads are publicly readable"
  on threads for select
  using (deleted_at is null);

-- Authenticated users can create threads
create policy "Authenticated users can create threads"
  on threads for insert
  with check (auth.uid() = author_id);

-- Authors can update their own threads
create policy "Authors can update own threads"
  on threads for update
  using (auth.uid() = author_id);

-- Indexes
create index idx_threads_community_feed on threads (community_id, created_at desc);
create index idx_threads_author on threads (author_id, created_at desc);
create index idx_threads_bounty on threads (status, bounty_amount desc);
create index idx_threads_question_type on threads (question_type, status);


-- --------------------------------------------------------
-- 4. ANSWERS
-- --------------------------------------------------------
create table answers (
  id              uuid primary key default gen_random_uuid(),
  thread_id       uuid not null references threads(id) on delete cascade,
  author_id       uuid references profiles(id) on delete set null,
  body            text not null,
  is_accepted     boolean not null default false,
  score           int not null default 0,
  stake_amount    int not null default 0,
  stake_settled   boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz
);

alter table answers enable row level security;

-- Anyone can read answers (that aren't soft-deleted)
create policy "Answers are publicly readable"
  on answers for select
  using (deleted_at is null);

-- Authenticated users can create answers
create policy "Authenticated users can create answers"
  on answers for insert
  with check (auth.uid() = author_id);

-- Authors can update their own answers
create policy "Authors can update own answers"
  on answers for update
  using (auth.uid() = author_id);

-- Indexes
create index idx_answers_thread_score on answers (thread_id, score desc);
create index idx_answers_author on answers (author_id, created_at desc);


-- --------------------------------------------------------
-- 5. CIRCULAR FK — accepted_answer_id on threads
-- --------------------------------------------------------
alter table threads
  add column accepted_answer_id uuid references answers(id);


-- --------------------------------------------------------
-- 6. AUTO-CREATE PROFILE ON SIGNUP (trigger)
-- --------------------------------------------------------
-- When a user signs up via Supabase Auth, automatically create
-- a profiles row so the app always has a profile to read.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || left(new.id::text, 8)),
    coalesce(new.raw_user_meta_data->>'display_name', 'New User')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
