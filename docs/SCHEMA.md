# Elev8 — Database Schema v0.1

---

## Migration Order

Run tables in this order to respect foreign key dependencies:

1. `profiles`, `communities`
2. `profile_credits`, `token_balances`, `community_memberships`, `community_reputation`
3. `threads`, `thread_type_votes`, `thread_contributors`, `thread_subscriptions`
4. `answers`, `answer_votes`, `answer_reactions`
5. `bounties`, `credit_transactions`, `token_transactions`, `staking_positions`
6. `oracle_resolutions`, `moderation_actions`
7. `ALTER TABLE threads ADD COLUMN accepted_answer_id uuid REFERENCES answers(id)`

> The circular FK between `threads.accepted_answer_id` and `answers.thread_id` requires threads to be created first, then the FK added after answers exists.

---

## Group 1 — Identity

### `profiles`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | Mirrors `auth.users.id` |
| `username` | `text NOT NULL UNIQUE` | |
| `display_name` | `text NOT NULL` | |
| `bio` | `text` | |
| `avatar_url` | `text` | |
| `credit_balance` | `int NOT NULL DEFAULT 0` | Cached summary — authoritative ledger is `credit_transactions` |
| `rac_score` | `numeric NOT NULL DEFAULT 0` | Aggregate reputation score — trigger-updated from `community_reputation` |
| `onboarding_stage` | `text NOT NULL DEFAULT 'subsidized'` | `subsidized \| earning \| custodial` |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |
| `updated_at` | `timestamptz NOT NULL DEFAULT now()` | |

---

### `profile_credits`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK DEFAULT gen_random_uuid()` | |
| `profile_id` | `uuid NOT NULL → profiles(id)` | |
| `amount` | `int NOT NULL` | Positive = credit, negative = debit |
| `type` | `text NOT NULL` | `grant \| earn \| spend \| stake \| unstake \| refund` |
| `ref_type` | `text` | `answer \| bounty \| vote \| onboarding` |
| `ref_id` | `uuid` | ID of triggering entity |
| `note` | `text` | |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |

---

### `token_balances`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK DEFAULT gen_random_uuid()` | |
| `profile_id` | `uuid NOT NULL → profiles(id)` | |
| `balance` | `numeric NOT NULL DEFAULT 0` | |
| `staked_amount` | `numeric NOT NULL DEFAULT 0` | |
| `custodial` | `boolean NOT NULL DEFAULT true` | |
| `wallet_address` | `text` | |
| `updated_at` | `timestamptz NOT NULL DEFAULT now()` | |

---

## Group 2 — Communities

### `communities`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK DEFAULT gen_random_uuid()` | |
| `name` | `text NOT NULL` | |
| `slug` | `text NOT NULL UNIQUE` | URL-safe identifier |
| `description` | `text` | |
| `icon_url` | `text` | |
| `created_by` | `uuid NOT NULL → profiles(id)` | |
| `is_private` | `boolean NOT NULL DEFAULT false` | |
| `is_nsfw` | `boolean NOT NULL DEFAULT false` | |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |
| `updated_at` | `timestamptz NOT NULL DEFAULT now()` | |

---

### `community_memberships`

| Column | Type | Notes |
|--------|------|-------|
| `community_id` | `uuid NOT NULL → communities(id) ON DELETE CASCADE` | |
| `profile_id` | `uuid NOT NULL → profiles(id) ON DELETE CASCADE` | |
| `role` | `text NOT NULL DEFAULT 'member'` | `member \| moderator \| admin` |
| `status` | `text NOT NULL DEFAULT 'active'` | `active \| banned \| muted` |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |
| **PK** | `(community_id, profile_id)` | |

---

### `community_reputation`

| Column | Type | Notes |
|--------|------|-------|
| `community_id` | `uuid NOT NULL → communities(id)` | |
| `profile_id` | `uuid NOT NULL → profiles(id)` | |
| `score` | `numeric NOT NULL DEFAULT 0` | |
| `answers_accepted` | `int NOT NULL DEFAULT 0` | |
| `oracle_agreements` | `int NOT NULL DEFAULT 0` | |
| `vote_accuracy` | `numeric NOT NULL DEFAULT 0` | |
| `updated_at` | `timestamptz NOT NULL DEFAULT now()` | |
| **PK** | `(community_id, profile_id)` | |

> Trigger: on update, recalculate `profiles.rac_score = SUM(score)` for that profile.

---

## Group 3 — Threads

### `threads`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK DEFAULT gen_random_uuid()` | |
| `community_id` | `uuid NOT NULL → communities(id) ON DELETE CASCADE` | |
| `author_id` | `uuid → profiles(id) ON DELETE SET NULL` | Nullable — preserves content on account deletion |
| `title` | `text NOT NULL` | |
| `body` | `text` | Markdown |
| `thread_type` | `text NOT NULL DEFAULT 'question'` | `question \| discussion \| link` |
| `question_type` | `text DEFAULT NULL` | `verifiable \| empirical \| contested` |
| `question_type_locked` | `boolean NOT NULL DEFAULT false` | |
| `status` | `text NOT NULL DEFAULT 'open'` | `open \| answered \| archived` |
| `accepted_answer_id` | `uuid → answers(id)` | Added via ALTER TABLE after answers created |
| `bounty_amount` | `int NOT NULL DEFAULT 0` | Cached — trigger-maintained |
| `score` | `int NOT NULL DEFAULT 0` | Cached net vote score |
| `answer_count` | `int NOT NULL DEFAULT 0` | Cached — trigger-maintained |
| `is_locked` | `boolean NOT NULL DEFAULT false` | |
| `is_pinned` | `boolean NOT NULL DEFAULT false` | |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |
| `updated_at` | `timestamptz NOT NULL DEFAULT now()` | |
| `deleted_at` | `timestamptz` | Soft delete |

---

### `thread_type_votes`

| Column | Type | Notes |
|--------|------|-------|
| `thread_id` | `uuid NOT NULL → threads(id) ON DELETE CASCADE` | |
| `profile_id` | `uuid NOT NULL → profiles(id) ON DELETE CASCADE` | |
| `vote` | `text NOT NULL` | `verifiable \| empirical \| contested` |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |
| **PK** | `(thread_id, profile_id)` | One vote per user per thread |

---

### `thread_contributors`

| Column | Type | Notes |
|--------|------|-------|
| `thread_id` | `uuid NOT NULL → threads(id) ON DELETE CASCADE` | |
| `profile_id` | `uuid NOT NULL → profiles(id) ON DELETE CASCADE` | |
| `role` | `text NOT NULL DEFAULT 'contributor'` | `asker \| contributor \| editor \| moderator` |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |
| **PK** | `(thread_id, profile_id)` | |

---

### `thread_subscriptions`

| Column | Type | Notes |
|--------|------|-------|
| `thread_id` | `uuid NOT NULL → threads(id) ON DELETE CASCADE` | |
| `profile_id` | `uuid NOT NULL → profiles(id) ON DELETE CASCADE` | |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |
| **PK** | `(thread_id, profile_id)` | |

---

## Group 4 — Answers

### `answers`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK DEFAULT gen_random_uuid()` | |
| `thread_id` | `uuid NOT NULL → threads(id) ON DELETE CASCADE` | |
| `author_id` | `uuid → profiles(id) ON DELETE SET NULL` | |
| `body` | `text NOT NULL` | Markdown |
| `is_accepted` | `boolean NOT NULL DEFAULT false` | |
| `score` | `int NOT NULL DEFAULT 0` | Weighted vote score |
| `stake_amount` | `int NOT NULL DEFAULT 0` | |
| `stake_settled` | `boolean NOT NULL DEFAULT false` | |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |
| `updated_at` | `timestamptz NOT NULL DEFAULT now()` | |
| `deleted_at` | `timestamptz` | Soft delete |

---

### `answer_votes`

| Column | Type | Notes |
|--------|------|-------|
| `answer_id` | `uuid NOT NULL → answers(id) ON DELETE CASCADE` | |
| `profile_id` | `uuid NOT NULL → profiles(id) ON DELETE CASCADE` | |
| `value` | `smallint NOT NULL` | `+1` or `-1` — `CHECK (value IN (-1, 1))` |
| `weight` | `numeric NOT NULL DEFAULT 1.0` | Stored denormalized at insert time |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |
| **PK** | `(answer_id, profile_id)` | |

---

### `answer_reactions`

| Column | Type | Notes |
|--------|------|-------|
| `answer_id` | `uuid NOT NULL → answers(id) ON DELETE CASCADE` | |
| `profile_id` | `uuid NOT NULL → profiles(id) ON DELETE CASCADE` | |
| `type` | `text NOT NULL` | `helpful \| well_cited \| actionable \| insightful \| solved_my_problem` |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |
| **PK** | `(answer_id, profile_id, type)` | One of each type per user per answer |

---

## Group 5 — Economics

### `bounties`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK DEFAULT gen_random_uuid()` | |
| `thread_id` | `uuid NOT NULL → threads(id) ON DELETE CASCADE` | |
| `created_by` | `uuid NOT NULL → profiles(id)` | |
| `amount_credits` | `int NOT NULL` | |
| `amount_tokens` | `numeric DEFAULT 0` | |
| `status` | `text NOT NULL DEFAULT 'open'` | `open \| awarded \| refunded \| canceled` |
| `awarded_answer_id` | `uuid → answers(id)` | |
| `awarded_at` | `timestamptz` | |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |

---

### `credit_transactions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK DEFAULT gen_random_uuid()` | |
| `profile_id` | `uuid NOT NULL → profiles(id)` | |
| `amount` | `int NOT NULL` | Positive = credit, negative = debit |
| `type` | `text NOT NULL` | `grant \| earn \| stake \| unstake \| bounty_award \| bounty_refund \| slash` |
| `ref_type` | `text` | |
| `ref_id` | `uuid` | |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |

---

### `token_transactions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK DEFAULT gen_random_uuid()` | |
| `profile_id` | `uuid NOT NULL → profiles(id)` | |
| `amount` | `numeric NOT NULL` | |
| `type` | `text NOT NULL` | `grant \| earn \| stake \| unstake \| bounty_award \| slash` |
| `simulated_tx_hash` | `text` | |
| `ref_type` | `text` | |
| `ref_id` | `uuid` | |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |

---

### `staking_positions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK DEFAULT gen_random_uuid()` | |
| `profile_id` | `uuid NOT NULL → profiles(id)` | |
| `answer_id` | `uuid NOT NULL → answers(id) ON DELETE CASCADE` | |
| `credit_amount` | `int NOT NULL DEFAULT 0` | |
| `token_amount` | `numeric NOT NULL DEFAULT 0` | |
| `status` | `text NOT NULL DEFAULT 'active'` | `active \| returned \| slashed \| partial` |
| `settled_at` | `timestamptz` | |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |

---

## Group 6 — Trust & Verification

### `oracle_resolutions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK DEFAULT gen_random_uuid()` | |
| `thread_id` | `uuid NOT NULL → threads(id)` | |
| `answer_id` | `uuid → answers(id)` | |
| `source_type` | `text NOT NULL` | `expert_panel \| scientific_citation \| community_supermajority \| ai_arbitration` |
| `source_url` | `text` | |
| `resolution_notes` | `text` | |
| `resolved_by` | `uuid → profiles(id)` | |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |

---

### `moderation_actions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK DEFAULT gen_random_uuid()` | |
| `target_type` | `text NOT NULL` | `thread \| answer \| profile` |
| `target_id` | `uuid NOT NULL` | |
| `acted_by` | `uuid NOT NULL → profiles(id)` | |
| `action` | `text NOT NULL` | `remove \| restore \| lock \| unlock \| ban \| unban \| warn` |
| `reason` | `text` | |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |

---

## Indexes

| Table | Index | Supports |
|-------|-------|----------|
| `threads` | `(community_id, created_at DESC)` | Community feed |
| `threads` | `(author_id, created_at DESC)` | Profile history |
| `threads` | `(status, bounty_amount DESC)` | High-value open questions |
| `threads` | `(question_type, status)` | Type-filtered views |
| `answers` | `(thread_id, score DESC)` | Best answer ranking |
| `answers` | `(author_id, created_at DESC)` | Profile answer history |
| `answer_votes` | `(profile_id)` | Vote history lookup |
| `answer_reactions` | `(answer_id, type)` | Reaction counts by type |
| `community_reputation` | `(profile_id)` | Reputation aggregation |
| `community_reputation` | `(community_id, score DESC)` | Community leaderboard |
| `credit_transactions` | `(profile_id, created_at DESC)` | User credit history |
| `staking_positions` | `(profile_id, status)` | Active stakes per user |
| `bounties` | `(thread_id, status)` | Open bounties per question |

---

## Row-Level Security

| Table | Read | Write |
|-------|------|-------|
| `profiles` | Public | Owner only (`auth.uid() = id`) |
| `community_reputation` | Public | System / trigger only |
| `communities` | Public | Creator + admin |
| `community_memberships` | Public | Self-insert to join; mod/admin for role changes |
| `threads` | Public | Authenticated to insert; author or mod to update/delete |
| `answers` | Public | Authenticated to insert; author or mod to update/delete |
| `answer_votes` | Public | Owner only (`auth.uid() = profile_id`) |
| `answer_reactions` | Public | Owner only |
| `thread_type_votes` | Public | Authenticated; one vote per user (enforced by PK) |
| `credit_transactions` | Owner only | System / trigger only |
| `token_transactions` | Owner only | System / trigger only |
| `staking_positions` | Owner only | System on stake/unstake actions |
| `bounties` | Public | Authenticated to create; system to award/refund |
| `oracle_resolutions` | Public | Moderator / admin only |
| `moderation_actions` | Public | Moderator / admin only |
