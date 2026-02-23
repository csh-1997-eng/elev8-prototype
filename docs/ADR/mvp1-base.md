# ADR: MVP1 Base — Database & Deployment Setup

**Date:** 2026-02-22
**Status:** Complete

---

## Context

The app was built with hardcoded mock data and no external services. Goal for this session: connect a real database, deploy to production, and have a shareable link with live data.

## Decisions

1. **Supabase publishable key over legacy anon key** — New Supabase projects issue `sb_publishable_` keys instead of JWT-based anon keys. Updated all env references from `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` across 4 files.

2. **Deploy first, database second** — Deployed to Vercel in mock mode immediately for a shareable link, then connected Supabase afterward. This gave instant feedback while the database was still being set up.

3. **Incremental schema, not full schema upfront** — The full schema has ~18 tables. Only created the 4 tables the current app uses (profiles, communities, threads, answers). Remaining tables will be added as features are built.

4. **Data access layer with mock fallback** — Created `lib/queries.ts` that checks `isMockMode` and either queries Supabase or returns mock data. Pages import from queries, not mock-data directly. App works identically with or without env vars.

5. **Seed profiles without auth accounts** — Inserted 5 test profiles directly into the profiles table (no corresponding `auth.users` rows). These are display-only. Real users sign up through the app, which triggers automatic profile creation via a Postgres trigger.

6. **Single Supabase project for now** — Local dev and Vercel production share the same database. Will split into dev/prod projects before real user data exists.

## What Was Implemented

- **Database:** 4 tables with RLS policies, indexes, and a signup trigger (`001_core_tables.sql`)
- **Seed data:** 5 profiles, 6 communities, 8 threads, 8 answers (`002_seed_data.sql`)
- **Data layer:** `lib/queries.ts` — 8 query functions with Supabase-to-app-type mapping
- **Auth:** Signup passes username metadata to Supabase; login creates real sessions; nav bar and profile page read from Supabase auth
- **Pages updated:** explore, community, thread, public profile — all read from database
- **Deployment:** Vercel project connected to GitHub repo with env vars configured

## Outcomes

- App reads from Supabase in production, mock data locally without env vars
- Real signup/login creates auth sessions and profile rows
- Profile edits persist to the database
- Shareable production URL with seeded content

## Next Steps

- Wire up real-time features (posting threads, submitting answers)
- Add remaining schema tables as features are built (reputation, economics, moderation)
- Split into dev/prod Supabase projects before inviting real testers
- Consider Supabase CLI for versioned migrations when schema changes become frequent
