-- backfill_reputation_scores.sql
-- One-time fixup: updates reputation rows that were seeded with score=0
-- by the original migration 006. Run this in your Supabase SQL Editor.
-- Not needed for fresh databases — the updated 006 seeds scores directly.

-- Cole: Technology 72, Startups 45, Crypto 25
UPDATE community_reputation SET score = 72, answers_accepted = 5, vote_accuracy = 0.82
WHERE profile_id = (SELECT id FROM profiles WHERE username = 'cole')
  AND community_id = (SELECT id FROM communities WHERE slug = 'technology');

UPDATE community_reputation SET score = 45, answers_accepted = 3, vote_accuracy = 0.75
WHERE profile_id = (SELECT id FROM profiles WHERE username = 'cole')
  AND community_id = (SELECT id FROM communities WHERE slug = 'startups');

UPDATE community_reputation SET score = 25, answers_accepted = 1, vote_accuracy = 0.60
WHERE profile_id = (SELECT id FROM profiles WHERE username = 'cole')
  AND community_id = (SELECT id FROM communities WHERE slug = 'crypto');

-- Alex: Philosophy 52, Crypto 20, Technology 15
UPDATE community_reputation SET score = 52, answers_accepted = 4, vote_accuracy = 0.78
WHERE profile_id = (SELECT id FROM profiles WHERE username = 'alex_r')
  AND community_id = (SELECT id FROM communities WHERE slug = 'philosophy');

UPDATE community_reputation SET score = 20, answers_accepted = 1, vote_accuracy = 0.65
WHERE profile_id = (SELECT id FROM profiles WHERE username = 'alex_r')
  AND community_id = (SELECT id FROM communities WHERE slug = 'crypto');

UPDATE community_reputation SET score = 15, answers_accepted = 1, vote_accuracy = 0.70
WHERE profile_id = (SELECT id FROM profiles WHERE username = 'alex_r')
  AND community_id = (SELECT id FROM communities WHERE slug = 'technology');

-- Priya: Science 38, Design 15, Technology 10
UPDATE community_reputation SET score = 38, answers_accepted = 3, vote_accuracy = 0.85
WHERE profile_id = (SELECT id FROM profiles WHERE username = 'priya_k')
  AND community_id = (SELECT id FROM communities WHERE slug = 'science');

UPDATE community_reputation SET score = 15, answers_accepted = 1, vote_accuracy = 0.72
WHERE profile_id = (SELECT id FROM profiles WHERE username = 'priya_k')
  AND community_id = (SELECT id FROM communities WHERE slug = 'design');

UPDATE community_reputation SET score = 10, answers_accepted = 0, vote_accuracy = 0.68
WHERE profile_id = (SELECT id FROM profiles WHERE username = 'priya_k')
  AND community_id = (SELECT id FROM communities WHERE slug = 'technology');

-- Marcus: Crypto 65, Technology 25, Startups 15
UPDATE community_reputation SET score = 65, answers_accepted = 6, vote_accuracy = 0.88
WHERE profile_id = (SELECT id FROM profiles WHERE username = 'marcus_j')
  AND community_id = (SELECT id FROM communities WHERE slug = 'crypto');

UPDATE community_reputation SET score = 25, answers_accepted = 2, vote_accuracy = 0.74
WHERE profile_id = (SELECT id FROM profiles WHERE username = 'marcus_j')
  AND community_id = (SELECT id FROM communities WHERE slug = 'technology');

UPDATE community_reputation SET score = 15, answers_accepted = 1, vote_accuracy = 0.70
WHERE profile_id = (SELECT id FROM profiles WHERE username = 'marcus_j')
  AND community_id = (SELECT id FROM communities WHERE slug = 'startups');

-- Sarah: Design 35, Startups 10, Science 6
UPDATE community_reputation SET score = 35, answers_accepted = 3, vote_accuracy = 0.80
WHERE profile_id = (SELECT id FROM profiles WHERE username = 'sarah_l')
  AND community_id = (SELECT id FROM communities WHERE slug = 'design');

UPDATE community_reputation SET score = 10, answers_accepted = 1, vote_accuracy = 0.65
WHERE profile_id = (SELECT id FROM profiles WHERE username = 'sarah_l')
  AND community_id = (SELECT id FROM communities WHERE slug = 'startups');

UPDATE community_reputation SET score = 6, answers_accepted = 0, vote_accuracy = 0.55
WHERE profile_id = (SELECT id FROM profiles WHERE username = 'sarah_l')
  AND community_id = (SELECT id FROM communities WHERE slug = 'science');
