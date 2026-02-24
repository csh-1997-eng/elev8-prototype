"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isMockMode, getSupabaseBrowserClient } from "@/lib/supabase";

const QUESTION_TYPES = [
  { value: "verifiable", label: "Verifiable", description: "Has a provably correct answer" },
  { value: "empirical", label: "Empirical", description: "Answers vary by experience" },
  { value: "contested", label: "Contested", description: "Experts genuinely disagree" },
] as const;

type QuestionType = (typeof QUESTION_TYPES)[number]["value"];

export default function ClassificationVote({
  threadId,
  currentType,
  isLocked,
}: {
  threadId: string;
  currentType: string | null;
  isLocked: boolean;
}) {
  const router = useRouter();
  const [userVote, setUserVote] = useState<QuestionType | null>(null);
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
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

      // Fetch existing votes
      const { data: votes } = await supabase
        .from("thread_type_votes")
        .select("vote, profile_id")
        .eq("thread_id", threadId);

      if (votes) {
        const counts: Record<string, number> = {};
        for (const v of votes) {
          counts[v.vote] = (counts[v.vote] || 0) + 1;
          if (v.profile_id === user.id) setUserVote(v.vote as QuestionType);
        }
        setVoteCounts(counts);
      }
    }

    init();
  }, [threadId]);

  async function handleVote(vote: QuestionType) {
    if (!userId || loading || isLocked) return;
    setLoading(true);

    try {
      if (isMockMode) {
        const newCounts = { ...voteCounts };
        if (userVote) newCounts[userVote] = (newCounts[userVote] || 1) - 1;
        newCounts[vote] = (newCounts[vote] || 0) + 1;
        setVoteCounts(newCounts);
        setUserVote(vote);
        setLoading(false);
        return;
      }

      const supabase = getSupabaseBrowserClient()!;

      if (userVote) {
        // Update existing vote
        await supabase
          .from("thread_type_votes")
          .update({ vote })
          .eq("thread_id", threadId)
          .eq("profile_id", userId);
      } else {
        // Insert new vote
        await supabase
          .from("thread_type_votes")
          .insert({ thread_id: threadId, profile_id: userId, vote });
      }

      const newCounts = { ...voteCounts };
      if (userVote) newCounts[userVote] = (newCounts[userVote] || 1) - 1;
      newCounts[vote] = (newCounts[vote] || 0) + 1;
      setVoteCounts(newCounts);
      setUserVote(vote);
      router.refresh();
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }

  // Already classified
  if (isLocked && currentType) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted">Classified as</span>
        <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
          {currentType}
        </span>
      </div>
    );
  }

  // Not logged in — just show current state
  if (!userId) {
    return currentType ? (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted">Current classification:</span>
        <span className="text-xs font-medium text-accent">{currentType}</span>
      </div>
    ) : null;
  }

  const totalVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted">
        What type of question is this?
        {totalVotes > 0 && (
          <span className="ml-1">({totalVotes} vote{totalVotes !== 1 ? "s" : ""})</span>
        )}
      </p>
      <div className="flex gap-2 flex-wrap">
        {QUESTION_TYPES.map((qt) => (
          <button
            key={qt.value}
            onClick={() => handleVote(qt.value)}
            disabled={loading}
            title={qt.description}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
              userVote === qt.value
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted hover:bg-surface-hover"
            }`}
          >
            {qt.label}
            {(voteCounts[qt.value] ?? 0) > 0 && (
              <span className="ml-1 opacity-60">{voteCounts[qt.value]}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
