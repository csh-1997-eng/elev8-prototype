"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isMockMode, getSupabaseBrowserClient } from "@/lib/supabase";

export default function NewAnswerForm({ threadId }: { threadId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      if (isMockMode) {
        const stored = localStorage.getItem("mock_user");
        setAuthed(!!stored);
        return;
      }

      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();
      setAuthed(!!user);
    }

    checkAuth();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!body.trim()) {
      setError("Answer cannot be empty");
      return;
    }

    setLoading(true);

    try {
      if (isMockMode) {
        setBody("");
        router.refresh();
        return;
      }

      const supabase = getSupabaseBrowserClient()!;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: insertError } = await supabase
        .from("answers")
        .insert({
          thread_id: threadId,
          author_id: user.id,
          body: body.trim(),
        });

      if (insertError) throw insertError;

      setBody("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Still loading auth state
  if (authed === null) return null;

  // Not logged in — show sign-in prompt
  if (!authed) {
    return (
      <div className="py-6 text-center border-t border-border">
        <Link href="/login" className="text-sm text-accent hover:underline">
          Sign in to answer
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label htmlFor="answer-body" className="block text-sm font-medium">
        Your Answer
      </label>
      <textarea
        id="answer-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        required
        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow resize-none"
        placeholder="Share your thoughts..."
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? "Posting..." : "Post Answer"}
      </button>

      {isMockMode && (
        <p className="text-xs text-muted px-4 py-2 rounded-lg bg-surface">
          Mock mode — answer will not persist.
        </p>
      )}
    </form>
  );
}
