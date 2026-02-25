-- ============================================================
-- Elev8 — Migration 002: Seed Data
-- Run in: Supabase Dashboard > SQL Editor
-- Note: SQL Editor runs as postgres role, bypassing RLS.
-- These profiles are NOT linked to auth.users — they're
-- display-only seed data. Real users sign up through the app.
-- ============================================================

-- --------------------------------------------------------
-- 1. PROFILES (5 seed users)
-- --------------------------------------------------------
insert into profiles (id, username, display_name, bio, created_at) values
  ('a1b2c3d4-0001-4000-8000-000000000001', 'cole',     'Cole Hoffman',   'Builder. Applied AI engineer. Trying to make the internet less extractive.', '2025-01-15T10:00:00Z'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'alex_r',   'Alex Rivera',    'Philosophy nerd. Thinks about systems and incentives.',                      '2025-02-01T12:00:00Z'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'priya_k',  'Priya Kumar',    'Full-stack dev. Obsessed with clean UI.',                                    '2025-02-10T08:00:00Z'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'marcus_j', 'Marcus Johnson', 'Crypto & DeFi researcher. Base chain maximalist.',                           '2025-03-01T14:00:00Z'),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'sarah_l',  'Sarah Lin',      'Product designer at a startup. Minimalism enthusiast.',                      '2025-03-15T09:00:00Z');


-- --------------------------------------------------------
-- 2. COMMUNITIES (6)
-- --------------------------------------------------------
insert into communities (id, name, slug, description, created_by, created_at) values
  ('c0000001-0001-4000-8000-000000000001', 'Technology',     'technology',  'Software, hardware, AI, and everything in between.',              'a1b2c3d4-0001-4000-8000-000000000001', '2025-01-20T10:00:00Z'),
  ('c0000001-0002-4000-8000-000000000002', 'Philosophy',     'philosophy',  'Big questions, clear thinking, honest debate.',                   'a1b2c3d4-0002-4000-8000-000000000002', '2025-01-22T10:00:00Z'),
  ('c0000001-0003-4000-8000-000000000003', 'Design',         'design',      'UI, UX, product design, and visual craft.',                       'a1b2c3d4-0005-4000-8000-000000000005', '2025-01-25T10:00:00Z'),
  ('c0000001-0004-4000-8000-000000000004', 'Crypto & Web3',  'crypto',      'Blockchain, DeFi, DAOs, and the decentralized future.',           'a1b2c3d4-0004-4000-8000-000000000004', '2025-02-01T10:00:00Z'),
  ('c0000001-0005-4000-8000-000000000005', 'Startups',       'startups',    'Building companies, fundraising, and growth.',                    'a1b2c3d4-0001-4000-8000-000000000001', '2025-02-05T10:00:00Z'),
  ('c0000001-0006-4000-8000-000000000006', 'Science',        'science',     'Research, discoveries, and the scientific method.',               'a1b2c3d4-0003-4000-8000-000000000003', '2025-02-10T10:00:00Z');


-- --------------------------------------------------------
-- 3. THREADS (8)
-- --------------------------------------------------------
insert into threads (id, title, body, community_id, author_id, score, answer_count, created_at) values
  (
    '10ed0001-0001-4000-8000-000000000001',
    'Why I think attention-based monetization is broken',
    'Social media companies optimize for engagement, not value. The content that gets the most likes isn''t necessarily the best content — it''s the most provocative. What if we could align financial incentives with actual content quality? I''ve been thinking about replacing likes with a token that represents real ownership in the platform...',
    'c0000001-0001-4000-8000-000000000001',
    'a1b2c3d4-0001-4000-8000-000000000001',
    47, 3,
    '2025-12-01T14:30:00Z'
  ),
  (
    '10ed0001-0002-4000-8000-000000000002',
    'The paradox of value in digital spaces',
    'We assign value to physical goods based on scarcity and utility. But digital content can be infinitely reproduced. So how do we create a system where quality content is genuinely valued? Is blockchain the answer, or are we just recreating the same problems with new technology?',
    'c0000001-0002-4000-8000-000000000002',
    'a1b2c3d4-0002-4000-8000-000000000002',
    34, 1,
    '2025-11-28T09:15:00Z'
  ),
  (
    '10ed0001-0003-4000-8000-000000000003',
    'Designing for trust: lessons from Apple''s UI philosophy',
    'Apple''s design language communicates reliability through simplicity. Every unnecessary element they remove increases user trust. When building social platforms, this principle is even more important — users need to trust where their money and attention go.',
    'c0000001-0003-4000-8000-000000000003',
    'a1b2c3d4-0005-4000-8000-000000000005',
    28, 1,
    '2025-11-25T16:45:00Z'
  ),
  (
    '10ed0001-0004-4000-8000-000000000004',
    'Base L2 is quietly becoming the best chain for consumer apps',
    'Low fees, Coinbase backing, growing ecosystem. If you''re building a consumer-facing crypto app, Base should be your default choice. Here''s why the transaction costs and developer experience make it ideal for microtransactions like content tipping...',
    'c0000001-0004-4000-8000-000000000004',
    'a1b2c3d4-0004-4000-8000-000000000004',
    63, 1,
    '2025-11-20T11:00:00Z'
  ),
  (
    '10ed0001-0005-4000-8000-000000000005',
    'How to validate a social app idea without building the whole thing',
    'Most social apps fail because they try to build everything at once. Start with a single interaction loop. For us, that means: post → comment → upvote. Get that feeling right first, then layer on complexity.',
    'c0000001-0005-4000-8000-000000000005',
    'a1b2c3d4-0001-4000-8000-000000000001',
    41, 0,
    '2025-11-18T13:20:00Z'
  ),
  (
    '10ed0001-0006-4000-8000-000000000006',
    'The neuroscience of doom scrolling and how to design against it',
    'Variable ratio reinforcement schedules are what make social media addictive. But what if the reward mechanism was tied to quality rather than quantity? A platform where you get rewarded for thoughtful engagement, not just screen time.',
    'c0000001-0006-4000-8000-000000000006',
    'a1b2c3d4-0003-4000-8000-000000000003',
    55, 0,
    '2025-11-15T10:30:00Z'
  ),
  (
    '10ed0001-0007-4000-8000-000000000007',
    'Should community moderators be compensated with tokens?',
    'Moderators are the backbone of any community platform, but they''re almost never compensated. If we have a native token, allocating a percentage to active moderators could solve this. Thoughts on the incentive design?',
    'c0000001-0004-4000-8000-000000000004',
    'a1b2c3d4-0002-4000-8000-000000000002',
    29, 1,
    '2025-11-12T15:45:00Z'
  ),
  (
    '10ed0001-0008-4000-8000-000000000008',
    'Minimal viable product vs minimal lovable product',
    'MVPs get you to market fast. But for social apps, the experience needs to feel good from day one. Nobody wants to join a community that feels broken. I''d argue we need an MLP — something people actually enjoy using, even if it''s limited in scope.',
    'c0000001-0005-4000-8000-000000000005',
    'a1b2c3d4-0005-4000-8000-000000000005',
    38, 1,
    '2025-11-10T08:00:00Z'
  );


-- --------------------------------------------------------
-- 4. ANSWERS (8 — mapped from mock comments)
-- Note: answers table has no parent_id, so all are top-level.
-- --------------------------------------------------------
insert into answers (id, thread_id, author_id, body, score, created_at) values
  (
    'a0500001-0001-4000-8000-000000000001',
    '10ed0001-0001-4000-8000-000000000001',
    'a1b2c3d4-0002-4000-8000-000000000002',
    'This is exactly what I''ve been thinking. The attention economy rewards outrage, not insight. A token-based system could flip those incentives if designed correctly.',
    12,
    '2025-12-01T15:00:00Z'
  ),
  (
    'a0500001-0002-4000-8000-000000000002',
    '10ed0001-0001-4000-8000-000000000001',
    'a1b2c3d4-0004-4000-8000-000000000004',
    'How do you prevent whales from just buying influence though? That''s the problem with most token-based governance.',
    8,
    '2025-12-01T15:30:00Z'
  ),
  (
    'a0500001-0003-4000-8000-000000000003',
    '10ed0001-0001-4000-8000-000000000001',
    'a1b2c3d4-0001-4000-8000-000000000001',
    'Great point. I think quadratic voting or reputation-weighted tokens could help. One token ≠ one vote.',
    15,
    '2025-12-01T16:00:00Z'
  ),
  (
    'a0500001-0004-4000-8000-000000000004',
    '10ed0001-0002-4000-8000-000000000002',
    'a1b2c3d4-0003-4000-8000-000000000003',
    'Blockchain adds a verifiable layer, but the real innovation has to be in the incentive design, not the technology itself.',
    6,
    '2025-11-28T10:00:00Z'
  ),
  (
    'a0500001-0005-4000-8000-000000000005',
    '10ed0001-0004-4000-8000-000000000004',
    'a1b2c3d4-0001-4000-8000-000000000001',
    'The gas fees on Base are practically zero now. I tipped someone 0.50 USDC and the fee was less than a cent.',
    22,
    '2025-11-20T12:00:00Z'
  ),
  (
    'a0500001-0006-4000-8000-000000000006',
    '10ed0001-0008-4000-8000-000000000008',
    'a1b2c3d4-0003-4000-8000-000000000003',
    'Agreed on MLP over MVP. Reddit felt special early on because of the culture, not the features. Get the vibe right first.',
    9,
    '2025-11-10T09:30:00Z'
  ),
  (
    'a0500001-0007-4000-8000-000000000007',
    '10ed0001-0003-4000-8000-000000000003',
    'a1b2c3d4-0001-4000-8000-000000000001',
    'This Apple design philosophy translates so well to trust-based platforms. Less noise = more confidence in the content.',
    7,
    '2025-11-25T17:30:00Z'
  ),
  (
    'a0500001-0008-4000-8000-000000000008',
    '10ed0001-0007-4000-8000-000000000007',
    'a1b2c3d4-0005-4000-8000-000000000005',
    'Compensating moderators is a no-brainer if you have a native token. The hard part is measuring ''good moderation'' without gamifying it.',
    11,
    '2025-11-12T16:30:00Z'
  );
