"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isMockMode, getSupabaseBrowserClient } from "@/lib/supabase";

export default function AcceptAnswerButton({
  answerId,
  threadId,
  threadAuthorId,
  isAccepted,
}: {
  answerId: string;
  threadId: string;
  threadAuthorId: string;
  isAccepted: boolean;
}) {
  const router = useRouter();
  const [accepted, setAccepted] = useState(isAccepted);
  const [loading, setLoading] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      if (isMockMode) {
        const stored = localStorage.getItem("mock_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setIsAuthor(parsed.id === threadAuthorId);
        }
        return;
      }

      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) setIsAuthor(user.id === threadAuthorId);
    }

    checkAuth();
  }, [threadAuthorId]);

  async function handleAccept() {
    if (loading) return;
    setLoading(true);

    try {
      if (isMockMode) {
        setAccepted(!accepted);
        setLoading(false);
        return;
      }

      const supabase = getSupabaseBrowserClient()!;

      if (accepted) {
        // Un-accept
        await supabase
          .from("threads")
          .update({ accepted_answer_id: null, status: "open" })
          .eq("id", threadId);
        await supabase
          .from("answers")
          .update({ is_accepted: false })
          .eq("id", answerId);
        setAccepted(false);
      } else {
        // Clear any previously accepted answer
        await supabase
          .from("answers")
          .update({ is_accepted: false })
          .eq("thread_id", threadId)
          .eq("is_accepted", true);

        // Accept this answer
        await supabase
          .from("threads")
          .update({ accepted_answer_id: answerId, status: "answered" })
          .eq("id", threadId);
        await supabase
          .from("answers")
          .update({ is_accepted: true })
          .eq("id", answerId);
        setAccepted(true);
      }

      router.refresh();
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }

  // Always show the checkmark if accepted (anyone can see it)
  // Only show clickable button if user is the thread author
  if (!isAuthor && !accepted) return null;

  return (
    <button
      onClick={isAuthor ? handleAccept : undefined}
      disabled={loading || !isAuthor}
      title={
        isAuthor
          ? accepted
            ? "Remove accepted answer"
            : "Accept this answer"
          : "Accepted answer"
      }
      className={`p-1 rounded transition-colors ${
        accepted
          ? "text-green-500"
          : isAuthor
            ? "text-muted hover:text-green-500"
            : "text-muted"
      } ${!isAuthor ? "cursor-default" : ""}`}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
  );
}
