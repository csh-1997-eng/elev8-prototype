import { getCommunitiesAll, getThreadsAll } from "@/lib/queries";
import CommunityCard from "../../components/community-card";
import ThreadCard from "../../components/thread-card";

export default async function ExplorePage() {
  const communities = await getCommunitiesAll();
  const threads = await getThreadsAll();

  return (
    <div className="space-y-10">
      {/* Communities section */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Communities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {communities.map((c) => (
            <CommunityCard key={c.id} community={c} />
          ))}
        </div>
      </section>

      {/* Trending threads */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Trending</h2>
        <div className="space-y-4">
          {threads.map((t) => (
            <ThreadCard key={t.id} thread={t} />
          ))}
        </div>
      </section>
    </div>
  );
}
