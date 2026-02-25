"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isMockMode, getSupabaseBrowserClient } from "@/lib/supabase";

// Mock memberships persist in localStorage so they survive page navigations
function getMockMemberships(): { community_id: string; profile_id: string }[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("mock_memberships");
  if (!stored) {
    // Seed from MOCK_MEMBERSHIPS on first access
    import("@/lib/mock-data").then(({ MOCK_MEMBERSHIPS }) => {
      localStorage.setItem(
        "mock_memberships",
        JSON.stringify(MOCK_MEMBERSHIPS.map((m) => ({ community_id: m.community_id, profile_id: m.profile_id })))
      );
    });
    return [];
  }
  return JSON.parse(stored);
}

function saveMockMemberships(memberships: { community_id: string; profile_id: string }[]) {
  localStorage.setItem("mock_memberships", JSON.stringify(memberships));
}

export default function JoinCommunityButton({
  communityId,
}: {
  communityId: string;
}) {
  const router = useRouter();
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function checkMembership() {
      if (isMockMode) {
        const stored = localStorage.getItem("mock_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUserId(parsed.id);

          // Ensure mock memberships are seeded into localStorage
          let memberships = JSON.parse(localStorage.getItem("mock_memberships") || "null");
          if (!memberships) {
            const { MOCK_MEMBERSHIPS } = await import("@/lib/mock-data");
            memberships = MOCK_MEMBERSHIPS.map((m) => ({
              community_id: m.community_id,
              profile_id: m.profile_id,
            }));
            localStorage.setItem("mock_memberships", JSON.stringify(memberships));
          }

          setIsMember(
            memberships.some(
              (m: { community_id: string; profile_id: string }) =>
                m.community_id === communityId && m.profile_id === parsed.id
            )
          );
        }
        setLoading(false);
        return;
      }

      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data } = await supabase
        .from("community_memberships")
        .select("profile_id")
        .eq("community_id", communityId)
        .eq("profile_id", user.id)
        .maybeSingle();

      setIsMember(!!data);
      setLoading(false);
    }

    checkMembership();
  }, [communityId]);

  async function handleToggle() {
    if (!userId || loading) return;
    setLoading(true);

    try {
      if (isMockMode) {
        const memberships = getMockMemberships();
        if (isMember) {
          const filtered = memberships.filter(
            (m) => !(m.community_id === communityId && m.profile_id === userId)
          );
          saveMockMemberships(filtered);
        } else {
          memberships.push({ community_id: communityId, profile_id: userId });
          saveMockMemberships(memberships);
        }
        setIsMember(!isMember);
        setLoading(false);
        return;
      }

      const supabase = getSupabaseBrowserClient()!;

      if (isMember) {
        await supabase
          .from("community_memberships")
          .delete()
          .eq("community_id", communityId)
          .eq("profile_id", userId);
        setIsMember(false);
      } else {
        await supabase
          .from("community_memberships")
          .insert({ community_id: communityId, profile_id: userId });
        setIsMember(true);
      }

      router.refresh();
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }

  if (loading && !userId) {
    return null;
  }

  if (!userId) {
    return (
      <a
        href="/login"
        className="px-4 py-2 text-sm font-medium rounded-full border border-border text-muted hover:bg-surface-hover transition-colors whitespace-nowrap"
      >
        Join
      </a>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
        isMember
          ? "border border-border text-muted hover:bg-surface-hover hover:text-red-500"
          : "bg-accent text-white hover:opacity-90"
      }`}
    >
      {loading ? "..." : isMember ? "Joined" : "Join"}
    </button>
  );
}
