-- 005_community_memberships.sql
-- Adds community_memberships table, member_count column on communities, and triggers

-- ── Add member_count to communities ──────────────────────
ALTER TABLE communities ADD COLUMN IF NOT EXISTS member_count int NOT NULL DEFAULT 0;

-- ── community_memberships table ──────────────────────────
CREATE TABLE community_memberships (
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  profile_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role         text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  status       text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'banned', 'muted')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (community_id, profile_id)
);

-- Index for "which communities does this user belong to?"
CREATE INDEX idx_memberships_profile ON community_memberships(profile_id);

-- ── Trigger: maintain communities.member_count ───────────
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE communities SET member_count = member_count + 1 WHERE id = NEW.community_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE communities SET member_count = member_count - 1 WHERE id = OLD.community_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    -- If status changed to/from active, adjust count
    IF OLD.status = 'active' AND NEW.status != 'active' THEN
      UPDATE communities SET member_count = member_count - 1 WHERE id = NEW.community_id;
    ELSIF OLD.status != 'active' AND NEW.status = 'active' THEN
      UPDATE communities SET member_count = member_count + 1 WHERE id = NEW.community_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_member_count
  AFTER INSERT OR DELETE OR UPDATE OF status ON community_memberships
  FOR EACH ROW EXECUTE FUNCTION update_community_member_count();

-- ── RLS Policies ─────────────────────────────────────────
ALTER TABLE community_memberships ENABLE ROW LEVEL SECURITY;

-- Anyone can read memberships
CREATE POLICY "Memberships are publicly readable"
  ON community_memberships FOR SELECT
  USING (true);

-- Authenticated users can join (insert their own membership)
CREATE POLICY "Users can join communities"
  ON community_memberships FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Users can leave (delete their own membership)
CREATE POLICY "Users can leave communities"
  ON community_memberships FOR DELETE
  USING (auth.uid() = profile_id);

-- ── Seed memberships for existing profiles ───────────────
-- Community creators get admin role, others get member
-- (Run after seed data is in place)

-- Cole → Technology (admin), Startups (admin), Crypto (member)
INSERT INTO community_memberships (community_id, profile_id, role) VALUES
  ((SELECT id FROM communities WHERE slug = 'technology'), (SELECT id FROM profiles WHERE username = 'cole'), 'admin'),
  ((SELECT id FROM communities WHERE slug = 'startups'), (SELECT id FROM profiles WHERE username = 'cole'), 'admin'),
  ((SELECT id FROM communities WHERE slug = 'crypto'), (SELECT id FROM profiles WHERE username = 'cole'), 'member');

-- Alex → Philosophy (admin), Crypto (member), Technology (member)
INSERT INTO community_memberships (community_id, profile_id, role) VALUES
  ((SELECT id FROM communities WHERE slug = 'philosophy'), (SELECT id FROM profiles WHERE username = 'alex_r'), 'admin'),
  ((SELECT id FROM communities WHERE slug = 'crypto'), (SELECT id FROM profiles WHERE username = 'alex_r'), 'member'),
  ((SELECT id FROM communities WHERE slug = 'technology'), (SELECT id FROM profiles WHERE username = 'alex_r'), 'member');

-- Priya → Science (admin), Design (member), Technology (member)
INSERT INTO community_memberships (community_id, profile_id, role) VALUES
  ((SELECT id FROM communities WHERE slug = 'science'), (SELECT id FROM profiles WHERE username = 'priya_k'), 'admin'),
  ((SELECT id FROM communities WHERE slug = 'design'), (SELECT id FROM profiles WHERE username = 'priya_k'), 'member'),
  ((SELECT id FROM communities WHERE slug = 'technology'), (SELECT id FROM profiles WHERE username = 'priya_k'), 'member');

-- Marcus → Crypto (admin), Technology (member), Startups (member)
INSERT INTO community_memberships (community_id, profile_id, role) VALUES
  ((SELECT id FROM communities WHERE slug = 'crypto'), (SELECT id FROM profiles WHERE username = 'marcus_j'), 'admin'),
  ((SELECT id FROM communities WHERE slug = 'technology'), (SELECT id FROM profiles WHERE username = 'marcus_j'), 'member'),
  ((SELECT id FROM communities WHERE slug = 'startups'), (SELECT id FROM profiles WHERE username = 'marcus_j'), 'member');

-- Sarah → Design (admin), Startups (member), Science (member)
INSERT INTO community_memberships (community_id, profile_id, role) VALUES
  ((SELECT id FROM communities WHERE slug = 'design'), (SELECT id FROM profiles WHERE username = 'sarah_l'), 'admin'),
  ((SELECT id FROM communities WHERE slug = 'startups'), (SELECT id FROM profiles WHERE username = 'sarah_l'), 'member'),
  ((SELECT id FROM communities WHERE slug = 'science'), (SELECT id FROM profiles WHERE username = 'sarah_l'), 'member');
