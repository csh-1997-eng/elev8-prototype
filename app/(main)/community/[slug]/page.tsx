import Link from "next/link";
import { getCommunityBySlug, getThreadsByCommunity, getCommunityLeaderboard } from "@/lib/queries";
import ThreadCard from "../../../components/thread-card";
import JoinCommunityButton from "../../../components/join-community-button";
import CommunityLeaderboard from "../../../components/community-leaderboard";
import CommunityYourRep from "../../../components/community-your-rep";
import { notFound } from "next/navigation";

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const community = await getCommunityBySlug(slug);
  if (!community) notFound();

  const [threads, leaderboard] = await Promise.all([
    getThreadsByCommunity(slug),
    getCommunityLeaderboard(community.id),
  ]);

  const sorted = threads.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-8">
      {/* Community header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center text-xl">
            {community.name[0]}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{community.name}</h1>
            {community.description && (
              <p className="text-muted mt-1">{community.description}</p>
            )}
            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm text-muted">
                {community.member_count.toLocaleString()} members
              </p>
              <CommunityYourRep communityId={community.id} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <JoinCommunityButton communityId={community.id} />
          <Link
            href={`/community/${slug}/new`}
            className="px-4 py-2 text-sm font-medium rounded-full bg-foreground text-background hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Ask a Question
          </Link>
        </div>
      </div>

      {/* Content: threads + sidebar */}
      <div className="flex gap-8">
        {/* Threads */}
        <div className="flex-1 min-w-0 space-y-4">
          {sorted.length === 0 ? (
            <p className="text-muted text-center py-12">No threads yet.</p>
          ) : (
            sorted.map((t) => <ThreadCard key={t.id} thread={t} />)
          )}
        </div>

        {/* Sidebar: leaderboard */}
        {leaderboard.length > 0 && (
          <div className="hidden lg:block w-72 shrink-0">
            <CommunityLeaderboard entries={leaderboard} />
          </div>
        )}
      </div>
    </div>
  );
}
