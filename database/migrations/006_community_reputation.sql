-- 006_community_reputation.sql
-- Adds community_reputation table, rac_score column on profiles, and triggers

-- ── Add rac_score to profiles ────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rac_score numeric NOT NULL DEFAULT 0;

-- ── community_reputation table ───────────────────────────
CREATE TABLE community_reputation (
  community_id      uuid NOT NULL REFERENCES communities(id),
  profile_id        uuid NOT NULL REFERENCES profiles(id),
  score             numeric NOT NULL DEFAULT 0,
  answers_accepted  int NOT NULL DEFAULT 0,
  oracle_agreements int NOT NULL DEFAULT 0,
  vote_accuracy     numeric NOT NULL DEFAULT 0,
  updated_at        timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (community_id, profile_id)
);

-- Index for aggregating reputation by profile
CREATE INDEX idx_reputation_profile ON community_reputation(profile_id);

-- Index for community leaderboard (sorted by score)
CREATE INDEX idx_reputation_leaderboard ON community_reputation(community_id, score DESC);

-- ── Trigger: recalculate profiles.rac_score on reputation change ──
CREATE OR REPLACE FUNCTION recalculate_rac_score()
RETURNS trigger AS $$
BEGIN
  UPDATE profiles
  SET rac_score = COALESCE(
    (SELECT SUM(score) FROM community_reputation WHERE profile_id = NEW.profile_id),
    0
  )
  WHERE id = NEW.profile_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_recalculate_rac_score
  AFTER INSERT OR UPDATE OF score ON community_reputation
  FOR EACH ROW EXECUTE FUNCTION recalculate_rac_score();

-- ── Trigger: auto-create reputation row when user joins a community ──
CREATE OR REPLACE FUNCTION init_community_reputation()
RETURNS trigger AS $$
BEGIN
  INSERT INTO community_reputation (community_id, profile_id)
  VALUES (NEW.community_id, NEW.profile_id)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_init_reputation_on_join
  AFTER INSERT ON community_memberships
  FOR EACH ROW EXECUTE FUNCTION init_community_reputation();

-- ── RLS Policies ─────────────────────────────────────────
ALTER TABLE community_reputation ENABLE ROW LEVEL SECURITY;

-- Anyone can read reputation
CREATE POLICY "Reputation is publicly readable"
  ON community_reputation FOR SELECT
  USING (true);

-- System-managed — no direct user writes (triggers handle updates)
-- If manual admin updates are needed, they go through service role

-- ── Seed reputation for existing members ─────────────────
-- Initialize reputation rows with starter scores for seed profiles.
-- The rac_score trigger fires on each INSERT, keeping profiles.rac_score in sync.

-- Cole: Technology 72, Startups 45, Crypto 25
INSERT INTO community_reputation (community_id, profile_id, score, answers_accepted, vote_accuracy) VALUES
  ((SELECT id FROM communities WHERE slug = 'technology'), (SELECT id FROM profiles WHERE username = 'cole'), 72, 5, 0.82),
  ((SELECT id FROM communities WHERE slug = 'startups'),   (SELECT id FROM profiles WHERE username = 'cole'), 45, 3, 0.75),
  ((SELECT id FROM communities WHERE slug = 'crypto'),     (SELECT id FROM profiles WHERE username = 'cole'), 25, 1, 0.60)
ON CONFLICT DO NOTHING;

-- Alex: Philosophy 52, Crypto 20, Technology 15
INSERT INTO community_reputation (community_id, profile_id, score, answers_accepted, vote_accuracy) VALUES
  ((SELECT id FROM communities WHERE slug = 'philosophy'), (SELECT id FROM profiles WHERE username = 'alex_r'), 52, 4, 0.78),
  ((SELECT id FROM communities WHERE slug = 'crypto'),     (SELECT id FROM profiles WHERE username = 'alex_r'), 20, 1, 0.65),
  ((SELECT id FROM communities WHERE slug = 'technology'), (SELECT id FROM profiles WHERE username = 'alex_r'), 15, 1, 0.70)
ON CONFLICT DO NOTHING;

-- Priya: Science 38, Design 15, Technology 10
INSERT INTO community_reputation (community_id, profile_id, score, answers_accepted, vote_accuracy) VALUES
  ((SELECT id FROM communities WHERE slug = 'science'),    (SELECT id FROM profiles WHERE username = 'priya_k'), 38, 3, 0.85),
  ((SELECT id FROM communities WHERE slug = 'design'),     (SELECT id FROM profiles WHERE username = 'priya_k'), 15, 1, 0.72),
  ((SELECT id FROM communities WHERE slug = 'technology'), (SELECT id FROM profiles WHERE username = 'priya_k'), 10, 0, 0.68)
ON CONFLICT DO NOTHING;

-- Marcus: Crypto 65, Technology 25, Startups 15
INSERT INTO community_reputation (community_id, profile_id, score, answers_accepted, vote_accuracy) VALUES
  ((SELECT id FROM communities WHERE slug = 'crypto'),     (SELECT id FROM profiles WHERE username = 'marcus_j'), 65, 6, 0.88),
  ((SELECT id FROM communities WHERE slug = 'technology'), (SELECT id FROM profiles WHERE username = 'marcus_j'), 25, 2, 0.74),
  ((SELECT id FROM communities WHERE slug = 'startups'),   (SELECT id FROM profiles WHERE username = 'marcus_j'), 15, 1, 0.70)
ON CONFLICT DO NOTHING;

-- Sarah: Design 35, Startups 10, Science 6
INSERT INTO community_reputation (community_id, profile_id, score, answers_accepted, vote_accuracy) VALUES
  ((SELECT id FROM communities WHERE slug = 'design'),     (SELECT id FROM profiles WHERE username = 'sarah_l'), 35, 3, 0.80),
  ((SELECT id FROM communities WHERE slug = 'startups'),   (SELECT id FROM profiles WHERE username = 'sarah_l'), 10, 1, 0.65),
  ((SELECT id FROM communities WHERE slug = 'science'),    (SELECT id FROM profiles WHERE username = 'sarah_l'),  6, 0, 0.55)
ON CONFLICT DO NOTHING;
