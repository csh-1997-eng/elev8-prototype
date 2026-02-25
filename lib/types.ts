export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  rac_score: number;
  created_at: string;
};

export type Community = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  created_by: string | null;
  member_count: number;
  created_at: string;
};

export type Thread = {
  id: string;
  title: string;
  body: string | null;
  community_id: string;
  author_id: string;
  thread_type: "question" | "discussion" | "link";
  question_type: "verifiable" | "empirical" | "contested" | null;
  question_type_locked: boolean;
  status: "open" | "answered" | "archived";
  accepted_answer_id: string | null;
  upvotes: number;
  comment_count: number;
  created_at: string;
  // Joined fields
  author?: Profile;
  community?: Community;
};

export type CommunityMembership = {
  community_id: string;
  profile_id: string;
  role: "member" | "moderator" | "admin";
  status: "active" | "banned" | "muted";
  created_at: string;
  // Joined fields
  profile?: Profile;
  community?: Community;
};

export type CommunityReputation = {
  community_id: string;
  profile_id: string;
  score: number;
  answers_accepted: number;
  oracle_agreements: number;
  vote_accuracy: number;
  updated_at: string;
  // Joined fields
  profile?: Profile;
  community?: Community;
};

export type Comment = {
  id: string;
  body: string;
  thread_id: string;
  author_id: string;
  parent_id: string | null;
  is_accepted: boolean;
  upvotes: number;
  created_at: string;
  // Joined fields
  author?: Profile;
};
