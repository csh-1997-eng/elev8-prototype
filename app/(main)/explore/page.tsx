import { MOCK_COMMUNITIES, MOCK_THREADS } from "@/lib/mock-data";
import CommunityCard from "../../components/community-card";
import ThreadCard from "../../components/thread-card";

export default function ExplorePage() {
  const communities = MOCK_COMMUNITIES;
  const threads = [...MOCK_THREADS].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

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
