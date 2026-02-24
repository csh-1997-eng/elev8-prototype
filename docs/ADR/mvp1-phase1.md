# ADR: MVP1 Phase 1 — Core Interaction Loop

**Date:** 2026-02-24
**Status:** Complete
**Depends on:** mvp1-base

---

## Context

The app was read-only after mvp1-base — users could browse communities, threads, and profiles, but couldn't create or interact with content. Phase 1 adds the core interaction loop: posting threads, submitting answers, voting on answers, classifying questions, and accepting answers.

## What Was Implemented

### 1a. Post a Thread
- **New page:** `/community/[slug]/new` — server component resolves community by slug, renders client form
- **New component:** `app/components/new-thread-form.tsx` — title, body, thread type selector (question/discussion/link)
- **Modified:** community page header — added "Ask a Question" link
- **Auth gating:** form page redirects to `/login` if not authenticated
- **DB:** inserts into `threads` table with `author_id` from auth session

### 1b. Post an Answer
- **New component:** `app/components/new-answer-form.tsx` — textarea with auth check, embedded on thread page
- **New migration:** `003_answer_count_trigger.sql` — trigger to auto-increment `threads.answer_count` on insert, decrement on soft delete
- **Modified:** thread page — answer form appears below the comments list
- **Auth UX:** shows "Sign in to answer" link when logged out, form when logged in

### 1c. Answer Voting
- **New component:** `app/components/answer-vote-buttons.tsx` — upvote/downvote with optimistic UI, fetches user's existing vote on mount
- **New migration:** `004_voting_and_classification.sql` — `answer_votes` table with composite PK `(answer_id, profile_id)`, value constrained to +1/-1, weight column (default 1.0 for now)
- **DB trigger:** `recalculate_answer_score` — updates `answers.score` as `SUM(value * weight)` on any vote change
- **Modified:** `comment-card.tsx` — replaced static upvote count with interactive vote buttons

### 1d. Question Type Classification
- **New component:** `app/components/classification-vote.tsx` — voting widget for verifiable/empirical/contested, shows vote counts and locked state
- **DB table:** `thread_type_votes` with composite PK `(thread_id, profile_id)` (included in migration 004)
- **DB trigger:** `check_classification_threshold` — auto-sets `question_type` and locks when 5+ votes reach >60% agreement
- **Modified:** thread page — classification widget appears below body for question-type threads

### 1e. Accept Answer
- **New component:** `app/components/accept-answer-button.tsx` — checkmark button visible only to thread author, toggles accepted state
- **DB updates:** sets `threads.accepted_answer_id`, `threads.status = 'answered'`, and `answers.is_accepted = true`
- **Modified:** `comment-card.tsx` — accepted answers get green highlight border and "Accepted" badge
- **Modified:** thread page header — shows "Answered" status badge when applicable

### Type System Updates
- **`lib/types.ts`:** Thread type extended with `thread_type`, `question_type`, `question_type_locked`, `status`, `accepted_answer_id`. Comment type extended with `is_accepted`.
- **`lib/queries.ts`:** `mapThread` and `mapComment` updated to include new fields
- **`lib/mock-data.ts`:** all 8 mock threads and 8 mock comments updated with new field defaults
- **`app/(main)/profile/page.tsx`:** thread mapping in profile page updated for new fields

## Migrations

| File | Tables/Triggers |
|------|----------------|
| `003_answer_count_trigger.sql` | Triggers on `answers` to maintain `threads.answer_count` |
| `004_voting_and_classification.sql` | `answer_votes`, `thread_type_votes`, score recalculation trigger, classification threshold trigger |

## Decisions

1. **Client components for all interactive features** — voting, classification, and accept buttons are client components embedded in server-rendered pages. Auth state is checked on the client via `supabase.auth.getUser()`.

2. **Optimistic UI for voting** — vote buttons update the displayed score immediately, then persist to the database. No loading spinners for vote actions.

3. **Deferred thread_contributors and thread_subscriptions** — the schema defines these tables but they aren't needed for basic posting. Will be added when notification or contributor tracking features are built.

4. **Unweighted voting for now** — `answer_votes.weight` defaults to 1.0. The column exists so weighted voting (Phase 2) can be added without schema changes.

5. **Classification threshold hardcoded** — 5 votes with >60% agreement. Implemented as a DB trigger so it runs regardless of how votes are inserted.

## Outcomes

- Users can post threads in any community
- Users can submit answers to threads
- Users can upvote/downvote answers (score updates in real time)
- Question-type threads show a classification voting widget
- Thread authors can accept an answer (green highlight, status badge)
- All features work in both mock and real mode
- Build passes with no type errors

