import { getSupabaseServerClient, isMockMode } from "./supabase-server";
import {
  MOCK_COMMUNITIES,
  MOCK_THREADS,
  MOCK_COMMENTS,
  getThreadsByCommunity as mockGetThreadsByCommunity,
  getThreadById as mockGetThreadById,
  getCommentsByThread as mockGetCommentsByThread,
  getCommunityBySlug as mockGetCommunityBySlug,
  getProfileById as mockGetProfileById,
  getThreadsByAuthor as mockGetThreadsByAuthor,
} from "./mock-data";
import type { Profile, Community, Thread, Comment } from "./types";

// ── Helpers ──────────────────────────────────────────────

// Map DB thread row (score, answer_count) → app Thread type (upvotes, comment_count)
function mapThread(
  row: Record<string, unknown>,
  author?: Profile,
  community?: Community
): Thread {
  return {
    id: row.id as string,
    title: row.title as string,
    body: (row.body as string) ?? null,
    community_id: row.community_id as string,
    author_id: row.author_id as string,
    upvotes: (row.score as number) ?? 0,
    comment_count: (row.answer_count as number) ?? 0,
    created_at: row.created_at as string,
    author,
    community,
  };
}

function mapProfile(row: Record<string, unknown>): Profile {
  return {
    id: row.id as string,
    username: row.username as string,
    display_name: (row.display_name as string) ?? null,
    bio: (row.bio as string) ?? null,
    avatar_url: (row.avatar_url as string) ?? null,
    created_at: row.created_at as string,
  };
}

function mapCommunity(row: Record<string, unknown>): Community {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: (row.description as string) ?? null,
    icon_url: (row.icon_url as string) ?? null,
    created_by: (row.created_by as string) ?? null,
    member_count: 0, // No community_memberships table yet
    created_at: row.created_at as string,
  };
}

function mapComment(
  row: Record<string, unknown>,
  author?: Profile
): Comment {
  return {
    id: row.id as string,
    body: row.body as string,
    thread_id: row.thread_id as string,
    author_id: row.author_id as string,
    parent_id: (row.parent_id as string) ?? null,
    upvotes: (row.score as number) ?? 0,
    created_at: row.created_at as string,
    author,
  };
}

// ── Queries ──────────────────────────────────────────────

export async function getCommunitiesAll(): Promise<Community[]> {
  if (isMockMode) return MOCK_COMMUNITIES;

  const supabase = await getSupabaseServerClient();
  if (!supabase) return MOCK_COMMUNITIES;

  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => mapCommunity(row));
}

export async function getThreadsAll(): Promise<Thread[]> {
  if (isMockMode) return MOCK_THREADS;

  const supabase = await getSupabaseServerClient();
  if (!supabase) return MOCK_THREADS;

  const { data, error } = await supabase
    .from("threads")
    .select("*, author:profiles!author_id(*), community:communities!community_id(*)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row) => {
    const author = row.author ? mapProfile(row.author) : undefined;
    const community = row.community ? mapCommunity(row.community) : undefined;
    return mapThread(row, author, community);
  });
}

export async function getThreadsByCommunity(slug: string): Promise<Thread[]> {
  if (isMockMode) return mockGetThreadsByCommunity(slug);

  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("threads")
    .select("*, author:profiles!author_id(*), community:communities!community_id!inner(*)")
    .eq("community.slug", slug)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row) => {
    const author = row.author ? mapProfile(row.author) : undefined;
    const community = row.community ? mapCommunity(row.community) : undefined;
    return mapThread(row, author, community);
  });
}

export async function getThreadById(id: string): Promise<Thread | undefined> {
  if (isMockMode) return mockGetThreadById(id);

  const supabase = await getSupabaseServerClient();
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from("threads")
    .select("*, author:profiles!author_id(*), community:communities!community_id(*)")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error || !data) return undefined;
  const author = data.author ? mapProfile(data.author) : undefined;
  const community = data.community ? mapCommunity(data.community) : undefined;
  return mapThread(data, author, community);
}

export async function getCommentsByThread(threadId: string): Promise<Comment[]> {
  if (isMockMode) return mockGetCommentsByThread(threadId);

  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("answers")
    .select("*, author:profiles!author_id(*)")
    .eq("thread_id", threadId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => {
    const author = row.author ? mapProfile(row.author) : undefined;
    return mapComment(row, author);
  });
}

export async function getCommunityBySlug(slug: string): Promise<Community | undefined> {
  if (isMockMode) return mockGetCommunityBySlug(slug);

  const supabase = await getSupabaseServerClient();
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return undefined;
  return mapCommunity(data);
}

export async function getProfileById(id: string): Promise<Profile | undefined> {
  if (isMockMode) return mockGetProfileById(id);

  const supabase = await getSupabaseServerClient();
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return undefined;
  return mapProfile(data);
}

export async function getThreadsByAuthor(authorId: string): Promise<Thread[]> {
  if (isMockMode) return mockGetThreadsByAuthor(authorId);

  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("threads")
    .select("*, author:profiles!author_id(*), community:communities!community_id(*)")
    .eq("author_id", authorId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row) => {
    const author = row.author ? mapProfile(row.author) : undefined;
    const community = row.community ? mapCommunity(row.community) : undefined;
    return mapThread(row, author, community);
  });
}
