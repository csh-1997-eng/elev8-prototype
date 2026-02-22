"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MOCK_CURRENT_USER, getThreadsByAuthor } from "@/lib/mock-data";
import { Profile } from "@/lib/types";
import Avatar from "../../components/avatar";
import ThreadCard from "../../components/thread-card";

export default function MyProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("mock_user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(stored) as Profile;
    setUser(parsed);
    setDisplayName(parsed.display_name || "");
    setBio(parsed.bio || "");
  }, [router]);

  function handleSave() {
    if (!user) return;
    const updated = { ...user, display_name: displayName, bio };
    localStorage.setItem("mock_user", JSON.stringify(updated));
    setUser(updated);
    setEditing(false);
  }

  function handleLogout() {
    localStorage.removeItem("mock_user");
    document.cookie = "mock_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/explore");
    router.refresh();
  }

  if (!user) return null;

  const threads = getThreadsByAuthor(user.id);

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
