-- Migration 004: Answer votes, thread type votes, and score triggers
-- Run in Supabase SQL Editor after 003

-- ── Answer Votes ─────────────────────────────────────────

create table answer_votes (
  answer_id   uuid not null references answers(id) on delete cascade,
  profile_id  uuid not null references profiles(id) on delete cascade,
  value       smallint not null check (value in (-1, 1)),
  weight      numeric not null default 1.0,
  created_at  timestamptz not null default now(),
  primary key (answer_id, profile_id)
);

alter table answer_votes enable row level security;

create policy "Answer votes are publicly readable"
  on answer_votes for select
  using (true);

create policy "Authenticated users can vote"
  on answer_votes for insert
  with check (auth.uid() = profile_id);

create policy "Users can update own votes"
  on answer_votes for update
  using (auth.uid() = profile_id);

create policy "Users can delete own votes"
  on answer_votes for delete
  using (auth.uid() = profile_id);

create index idx_answer_votes_profile on answer_votes (profile_id);

-- Trigger: recalculate answers.score on vote changes
create or replace function recalculate_answer_score()
returns trigger as $$
declare
  target_answer_id uuid;
begin
  target_answer_id := coalesce(NEW.answer_id, OLD.answer_id);
  update answers
  set score = coalesce(
    (select sum(value * weight) from answer_votes where answer_id = target_answer_id),
    0
  )
  where id = target_answer_id;
  return null;
end;
$$ language plpgsql security definer;

create trigger trg_answer_vote_score
  after insert or update or delete on answer_votes
  for each row
  execute function recalculate_answer_score();

-- ── Thread Type Votes ────────────────────────────────────

create table thread_type_votes (
  thread_id   uuid not null references threads(id) on delete cascade,
  profile_id  uuid not null references profiles(id) on delete cascade,
  vote        text not null check (vote in ('verifiable', 'empirical', 'contested')),
  created_at  timestamptz not null default now(),
  primary key (thread_id, profile_id)
);

alter table thread_type_votes enable row level security;

create policy "Thread type votes are publicly readable"
  on thread_type_votes for select
  using (true);

create policy "Authenticated users can classify"
  on thread_type_votes for insert
  with check (auth.uid() = profile_id);

create policy "Users can update own classification"
  on thread_type_votes for update
  using (auth.uid() = profile_id);

-- Trigger: auto-classify when threshold reached (5 votes, >60% agreement)
create or replace function check_classification_threshold()
returns trigger as $$
declare
  total_votes int;
  top_vote text;
  top_count int;
begin
  -- Skip if already locked
  if (select question_type_locked from threads where id = NEW.thread_id) then
    return NEW;
  end if;

  select count(*) into total_votes
  from thread_type_votes
  where thread_id = NEW.thread_id;

  if total_votes >= 5 then
    select vote, count(*) into top_vote, top_count
    from thread_type_votes
    where thread_id = NEW.thread_id
    group by vote
    order by count(*) desc
    limit 1;

    if top_count::numeric / total_votes > 0.6 then
      update threads
      set question_type = top_vote,
          question_type_locked = true
      where id = NEW.thread_id;
    end if;
  end if;

  return NEW;
end;
$$ language plpgsql security definer;

create trigger trg_classification_threshold
  after insert or update on thread_type_votes
  for each row
  execute function check_classification_threshold();
