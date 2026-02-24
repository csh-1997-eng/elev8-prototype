"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isMockMode, getSupabaseBrowserClient } from "@/lib/supabase";

export default function AnswerVoteButtons({
  answerId,
  initialScore,
}: {
  answerId: string;
  initialScore: number;
}) {
  const router = useRouter();
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<1 | -1 | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      if (isMockMode) {
        const stored = localStorage.getItem("mock_user");
        if (stored) setUserId(JSON.parse(stored).id);
        return;
      }

      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      // Check for existing vote
      const { data: vote } = await supabase
        .from("answer_votes")
        .select("value")
        .eq("answer_id", answerId)
        .eq("profile_id", user.id)
        .maybeSingle();

      if (vote) setUserVote(vote.value as 1 | -1);
    }

    init();
  }, [answerId]);

  async function handleVote(value: 1 | -1) {
    if (!userId || loading) return;
    setLoading(true);

    try {
      if (isMockMode) {
        if (userVote === value) {
          setScore(score - value);
          setUserVote(null);
        } else {
          setScore(score - (userVote ?? 0) + value);
          setUserVote(value);
        }
        setLoading(false);
        return;
      }

      const supabase = getSupabaseBrowserClient()!;

      if (userVote === value) {
        // Remove vote
        await supabase
          .from("answer_votes")
          .delete()
          .eq("answer_id", answerId)
          .eq("profile_id", userId);
        setScore(score - value);
        setUserVote(null);
      } else if (userVote) {
        // Change vote
        await supabase
          .from("answer_votes")
          .update({ value })
          .eq("answer_id", answerId)
          .eq("profile_id", userId);
        setScore(score - userVote + value);
        setUserVote(value);
      } else {
        // New vote
        await supabase
          .from("answer_votes")
          .insert({ answer_id: answerId, profile_id: userId, value });
        setScore(score + value);
        setUserVote(value);
      }

      router.refresh();
    } catch {
      // Revert on error
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleVote(1)}
        disabled={loading}
        className={`p-0.5 rounded transition-colors ${
          userVote === 1
            ? "text-accent"
            : "text-muted hover:text-foreground"
        }`}
        aria-label="Upvote"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      </button>
      <span className={`text-xs font-medium min-w-[1.5rem] text-center ${
        userVote === 1 ? "text-accent" : userVote === -1 ? "text-red-500" : "text-muted"
      }`}>
        {score}
      </span>
      <button
        onClick={() => handleVote(-1)}
        disabled={loading}
        className={`p-0.5 rounded transition-colors ${
          userVote === -1
            ? "text-red-500"
            : "text-muted hover:text-foreground"
        }`}
        aria-label="Downvote"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
    </div>
  );
}
