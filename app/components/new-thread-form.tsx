"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isMockMode, getSupabaseBrowserClient } from "@/lib/supabase";
import { Community } from "@/lib/types";

const THREAD_TYPES = [
  { value: "question", label: "Question" },
  { value: "discussion", label: "Discussion" },
  { value: "link", label: "Link" },
] as const;

type ThreadType = (typeof THREAD_TYPES)[number]["value"];

export default function NewThreadForm({ community }: { community: Community }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [threadType, setThreadType] = useState<ThreadType>("question");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      if (isMockMode) {
        const stored = localStorage.getItem("mock_user");
        if (!stored) {
          router.push("/login");
          return;
        }
        setAuthed(true);
        return;
      }

      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setAuthed(true);
    }

    checkAuth();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);

    try {
      if (isMockMode) {
        // Mock mode: just redirect back to community
        router.push(`/community/${community.slug}`);
        router.refresh();
        return;
      }

      const supabase = getSupabaseBrowserClient()!;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error: insertError } = await supabase
        .from("threads")
        .insert({
          community_id: community.id,
          author_id: user.id,
          title: title.trim(),
          body: body.trim() || null,
          thread_type: threadType,
        })
        .select("id")
        .single();

      if (insertError) throw insertError;
      if (!data) throw new Error("Failed to create thread");

      router.push(`/thread/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (authed === null) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Thread type selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Type</label>
        <div className="flex gap-2">
          {THREAD_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setThreadType(t.value)}
              className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                threadType === t.value
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted hover:bg-surface-hover"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1.5">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow"
          placeholder={
            threadType === "question"
              ? "What's your question?"
              : threadType === "link"
                ? "Share a link"
                : "Start a discussion"
          }
        />
      </div>

      {/* Body */}
      <div>
        <label htmlFor="body" className="block text-sm font-medium mb-1.5">
          {threadType === "question" ? "Details" : "Body"}
          <span className="text-muted font-normal ml-1">(optional)</span>
        </label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow resize-none"
          placeholder="Add context, details, or background..."
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl border border-border text-muted hover:bg-surface-hover transition-colors"
        >
          Cancel
        </button>
      </div>

      {isMockMode && (
        <p className="text-xs text-muted px-4 py-2 rounded-lg bg-surface">
          Mock mode — thread will not persist. Connect Supabase to enable real posting.
        </p>
      )}
    </form>
  );
}
