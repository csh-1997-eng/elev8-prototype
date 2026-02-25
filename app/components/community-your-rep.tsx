"use client";

import { useState, useEffect } from "react";
import { isMockMode, getSupabaseBrowserClient } from "@/lib/supabase";

export default function CommunityYourRep({
  communityId,
}: {
  communityId: string;
}) {
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      if (isMockMode) {
        const stored = localStorage.getItem("mock_user");
        if (!stored) return;
        const parsed = JSON.parse(stored);
        const { MOCK_REPUTATION } = await import("@/lib/mock-data");
        const rep = MOCK_REPUTATION.find(
          (r) => r.community_id === communityId && r.profile_id === parsed.id
        );
        if (rep) setScore(rep.score);
        return;
      }

      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("community_reputation")
        .select("score")
        .eq("community_id", communityId)
        .eq("profile_id", user.id)
        .maybeSingle();

      if (data) setScore(data.score);
    }

    load();
  }, [communityId]);

  if (score === null) return null;

  return (
    <span className="text-xs font-medium text-accent">
      Your rep: {score}
    </span>
  );
}
