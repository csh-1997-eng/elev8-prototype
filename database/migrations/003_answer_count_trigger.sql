-- Trigger: auto-update threads.answer_count when answers are inserted or soft-deleted
-- Run in Supabase SQL Editor after 001_core_tables.sql and 002_seed_data.sql

-- Function: increment answer_count on new answer
create or replace function increment_answer_count()
returns trigger as $$
begin
  update threads
  set answer_count = answer_count + 1
  where id = NEW.thread_id;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger trg_answer_insert_count
  after insert on answers
  for each row
  execute function increment_answer_count();

-- Function: adjust answer_count when answer is soft-deleted or restored
create or replace function adjust_answer_count_on_soft_delete()
returns trigger as $$
begin
  -- Soft delete: deleted_at changed from NULL to a value
  if OLD.deleted_at is null and NEW.deleted_at is not null then
    update threads
    set answer_count = greatest(answer_count - 1, 0)
    where id = NEW.thread_id;
  -- Restore: deleted_at changed from a value to NULL
  elsif OLD.deleted_at is not null and NEW.deleted_at is null then
    update threads
    set answer_count = answer_count + 1
    where id = NEW.thread_id;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger trg_answer_soft_delete_count
  after update of deleted_at on answers
  for each row
  execute function adjust_answer_count_on_soft_delete();
