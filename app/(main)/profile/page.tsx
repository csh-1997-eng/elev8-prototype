"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getThreadsByAuthor, getReputationByProfile as mockGetReputationByProfile, getProfileById as mockGetProfileById } from "@/lib/mock-data";
import { isMockMode, getSupabaseBrowserClient } from "@/lib/supabase";
import { Profile, Thread, CommunityReputation } from "@/lib/types";
import Avatar from "../../components/avatar";
import ThreadCard from "../../components/thread-card";

export default function MyProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [reputation, setReputation] = useState<CommunityReputation[]>([]);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (isMockMode) {
        const stored = localStorage.getItem("mock_user");
        if (!stored) {
          router.push("/login");
          return;
        }
        const parsed = JSON.parse(stored);
        // Merge with current mock profile data (localStorage may be stale)
        const freshProfile = mockGetProfileById(parsed.id);
        const profile: Profile = {
          ...parsed,
          rac_score: freshProfile?.rac_score ?? parsed.rac_score ?? 0,
        };
        setUser(profile);
        setDisplayName(profile.display_name || "");
        setBio(profile.bio || "");
        setThreads(getThreadsByAuthor(parsed.id));
        setReputation(mockGetReputationByProfile(parsed.id));
        return;
      }

      // Real Supabase auth
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        router.push("/login");
        return;
      }

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push("/login");
        return;
      }

      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (!profile) {
        router.push("/login");
        return;
      }

      const mapped: Profile = {
        id: profile.id,
        username: profile.username,
        display_name: profile.display_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        rac_score: profile.rac_score ?? 0,
        created_at: profile.created_at,
      };
      setUser(mapped);
      setDisplayName(mapped.display_name || "");
      setBio(mapped.bio || "");

      // Fetch user's threads
      const { data: threadRows } = await supabase
        .from("threads")
        .select("*, author:profiles!author_id(*), community:communities!community_id(*)")
        .eq("author_id", authUser.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (threadRows) {
        setThreads(
          threadRows.map((row) => ({
            id: row.id,
            title: row.title,
            body: row.body,
            community_id: row.community_id,
            author_id: row.author_id,
            thread_type: row.thread_type ?? "question",
            question_type: row.question_type ?? null,
            question_type_locked: row.question_type_locked ?? false,
            status: row.status ?? "open",
            accepted_answer_id: row.accepted_answer_id ?? null,
            upvotes: row.score ?? 0,
            comment_count: row.answer_count ?? 0,
            created_at: row.created_at,
            author: row.author ? {
              id: row.author.id,
              username: row.author.username,
              display_name: row.author.display_name,
              bio: row.author.bio,
              avatar_url: row.author.avatar_url,
              rac_score: row.author.rac_score ?? 0,
              created_at: row.author.created_at,
            } : undefined,
            community: row.community ? {
              id: row.community.id,
              name: row.community.name,
              slug: row.community.slug,
              description: row.community.description,
              icon_url: row.community.icon_url,
              created_by: row.community.created_by,
              member_count: row.community.member_count ?? 0,
              created_at: row.community.created_at,
            } : undefined,
          }))
        );
      }

      // Fetch reputation
      const { data: repRows } = await supabase
        .from("community_reputation")
        .select("*, community:communities!community_id(*)")
        .eq("profile_id", authUser.id)
        .order("score", { ascending: false });

      if (repRows) {
        setReputation(
          repRows.map((row) => ({
            community_id: row.community_id,
            profile_id: row.profile_id,
            score: row.score ?? 0,
            answers_accepted: row.answers_accepted ?? 0,
            oracle_agreements: row.oracle_agreements ?? 0,
            vote_accuracy: row.vote_accuracy ?? 0,
            updated_at: row.updated_at,
            community: row.community ? {
              id: row.community.id,
              name: row.community.name,
              slug: row.community.slug,
              description: row.community.description,
              icon_url: row.community.icon_url,
              created_by: row.community.created_by,
              member_count: row.community.member_count ?? 0,
              created_at: row.community.created_at,
            } : undefined,
          }))
        );
      }
    }

    loadProfile();
  }, [router]);

  async function handleSave() {
    if (!user) return;

    if (isMockMode) {
      const updated = { ...user, display_name: displayName, bio };
      localStorage.setItem("mock_user", JSON.stringify(updated));
      setUser(updated);
      setEditing(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, bio, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (!error) {
      setUser({ ...user, display_name: displayName, bio });
      setEditing(false);
    }
  }

  async function handleLogout() {
    if (isMockMode) {
      localStorage.removeItem("mock_user");
      document.cookie = "mock_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } else {
      const supabase = getSupabaseBrowserClient();
      if (supabase) await supabase.auth.signOut();
    }
    router.push("/explore");
    router.refresh();
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Profile header */}
      <div className="flex items-start gap-6">
        <Avatar name={user.display_name} size="lg" />
        <div className="flex-1">
          {editing ? (
            <div className="space-y-3">
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                placeholder="Display name"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                placeholder="Tell us about yourself..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-sm rounded-full border border-border text-muted hover:bg-surface-hover transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-semibold">
                {user.display_name || user.username}
              </h1>
              <p className="text-sm text-muted">@{user.username}</p>
              {user.bio && (
                <p className="mt-2 text-sm leading-relaxed">{user.bio}</p>
              )}
              {user.rac_score > 0 && (
                <p className="mt-2 text-sm font-medium text-accent">
                  RaC {user.rac_score}
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 text-sm rounded-full border border-border text-muted hover:bg-surface-hover transition-colors"
                >
                  Edit profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm rounded-full border border-border text-muted hover:bg-surface-hover transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reputation breakdown */}
      {reputation.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Reputation</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {reputation.map((r) => (
              <Link
                key={r.community_id}
                href={`/community/${r.community?.slug}`}
                className="rounded-xl border border-border p-3 hover:bg-surface-hover transition-colors"
              >
                <p className="text-sm font-medium truncate">
                  {r.community?.name}
                </p>
                <p className="text-lg font-semibold text-accent">{r.score}</p>
                <p className="text-xs text-muted">
                  {r.answers_accepted} accepted
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* User's threads */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Posts</h2>
        {threads.length === 0 ? (
          <p className="text-muted text-center py-8">No posts yet.</p>
        ) : (
          <div className="space-y-4">
            {threads.map((t) => (
              <ThreadCard key={t.id} thread={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
