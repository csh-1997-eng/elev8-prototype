export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
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
  upvotes: number;
  comment_count: number;
  created_at: string;
  // Joined fields
  author?: Profile;
  community?: Community;
};

export type Comment = {
  id: string;
  body: string;
  thread_id: string;
  author_id: string;
  parent_id: string | null;
  upvotes: number;
  created_at: string;
  // Joined fields
  author?: Profile;
};
