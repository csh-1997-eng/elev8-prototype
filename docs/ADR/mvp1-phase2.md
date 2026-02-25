# ADR: MVP1 Phase 2 — The Reputation Signal

**Date:** 2026-02-25
**Status:** Complete
**Depends on:** mvp1-phase1

---

## Context

After Phase 1, the app had a working interaction loop (post, answer, vote, classify, accept) but all votes carried equal weight and there was no concept of community membership or expertise tracking. Phase 2 adds the reputation infrastructure: community memberships, per-community reputation scores, weighted voting based on expertise, and community leaderboards.

## What Was Implemented

### 2a. Community Memberships + Member Counts
- **New component:** `app/components/join-community-button.tsx` — client component with Join/Leave toggle
- **New migration:** `005_community_memberships.sql` — `community_memberships` table, `member_count` column on communities, trigger to maintain count on join/leave/status change
- **Modified:** community page header — added join button, displays real member count from DB
- **Auth UX:** shows "Join" link to `/login` when not authenticated, toggle button when logged in
- **Mock mode:** persists membership state to localStorage (in-memory mutations don't survive Next.js page navigations)
- **RLS:** public read, authenticated insert/delete (own rows only)

### 2b. Community Reputation + RaC Score
- **New migration:** `006_community_reputation.sql` — `community_reputation` table, `rac_score` column on profiles
- **DB triggers:**
  - `recalculate_rac_score` — updates `profiles.rac_score = SUM(score)` whenever a community reputation score changes
  - `init_community_reputation` — auto-creates a reputation row (score 0) when a user joins a community
- **New component:** `app/components/community-your-rep.tsx` — shows "Your rep: X" inline on community pages for logged-in members
- **Modified:** profile pages (`/profile` and `/profile/[id]`) — display RaC score and per-community reputation breakdown grid with links to each community
- **RLS:** public read only (system-managed, no direct user writes)

### 2c. Weighted Voting
- **Modified:** `app/components/answer-vote-buttons.tsx` — on mount, looks up the voter's `vote_accuracy` from `community_reputation` for the thread's community. Stores this as `weight` on the vote insert.
- **DB behavior:** the existing `recalculate_answer_score` trigger (from Phase 1's migration 004) already computes `SUM(value * weight)`, so weighted scores work automatically once weights are populated.
- **Default:** new users or users without community reputation default to weight 1.0.
- **No UI change** — vote buttons look the same, but higher-reputation voters now have more influence on answer scores.

### 2d. Community Leaderboards
- **New component:** `app/components/community-leaderboard.tsx` — ranked list of top contributors showing rank, avatar, linked name, and reputation score
- **New query:** `getCommunityLeaderboard(communityId)` — fetches top 10 from `community_reputation` ordered by score DESC, joined with profiles
- **Modified:** community page — leaderboard sidebar (right column, hidden on mobile via `hidden lg:block`)
- **Layout:** thread list + leaderboard use a flex row with the leaderboard as a `w-72 shrink-0` sidebar

### Type System Updates
- **`lib/types.ts`:** Added `rac_score` to `Profile`, new `CommunityMembership` and `CommunityReputation` types
- **`lib/queries.ts`:** Updated `mapProfile` (rac_score), `mapCommunity` (real member_count from DB), added `mapReputation`, `getReputationByProfile`, `getCommunityLeaderboard`
- **`lib/mock-data.ts`:** Added `rac_score` to all 5 mock profiles, added `MOCK_MEMBERSHIPS` (15 entries), `MOCK_REPUTATION` (15 entries), and helper functions (`getMembershipsByProfile`, `getVoterWeight`, `getCommunityLeaderboard`, etc.)

### Profile Link Navigation
- **Modified:** `app/components/thread-card.tsx` — made author names clickable links to `/profile/[id]`; converted to client component with `div` wrapper + `router.push()` to avoid nested `<a>` tags
- **Modified:** `app/components/comment-card.tsx` — made author avatar and name clickable `<Link>` to `/profile/[id]`
- **Modified:** `app/(main)/thread/[id]/page.tsx` — made thread author avatar and name clickable

## Migrations

| File | Tables/Triggers |
|------|----------------|
| `005_community_memberships.sql` | `community_memberships` table, `member_count` column on communities, count maintenance trigger, seed memberships for 5 profiles |
| `006_community_reputation.sql` | `community_reputation` table, `rac_score` column on profiles, RaC recalculation trigger, auto-init reputation on join trigger, seed reputation with scores |

**Utility:** `docs/utilties/backfill_reputation_scores.sql` — one-time UPDATE script for dev databases that ran the original 006 before seed scores were added.

## Decisions

1. **localStorage for mock membership persistence** — Next.js server components re-render on navigation, so in-memory array mutations are lost. Mock memberships are seeded to localStorage on first access and mutated there.

2. **Voter weight = vote_accuracy** — When a user votes on an answer, their `community_reputation.vote_accuracy` for that community is stored as the vote's `weight`. This piggybacks on the existing `SUM(value * weight)` trigger from Phase 1.

3. **Auto-init reputation on community join** — A DB trigger creates a zero-score reputation row whenever a user joins a community. This ensures every member has a reputation entry without application code needing to manage it.

4. **Leaderboard hidden on mobile** — The sidebar uses `hidden lg:block` to keep the mobile layout clean. Leaderboard data is still fetched but only rendered on larger screens.

5. **Thread card converted to client component** — The card wrapper changed from `<Link>` to a `<div>` with `onClick` + `router.push()` to allow nested `<Link>` elements for author profile navigation without violating HTML nesting rules (`<a>` inside `<a>`).

6. **Seed data includes realistic scores** — Migration 006 seeds reputation rows with non-zero scores so leaderboards and profile reputation are populated immediately for demo/review purposes.

## Outcomes

- Users can join and leave communities (persists across navigation)
- Community pages show real member counts
- Per-community reputation scores display on profiles and community pages
- RaC (aggregate reputation) score shows on all profile views
- Answer votes are weighted by the voter's community reputation
- Community leaderboards show top contributors in a sidebar
- Author names/avatars are clickable throughout the app, linking to profile pages
- All features work in both mock and real mode
- Build passes with no type errors
