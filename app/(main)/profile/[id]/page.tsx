import { getProfileById, getThreadsByAuthor, getReputationByProfile } from "@/lib/queries";
import { notFound } from "next/navigation";
import Avatar from "../../../components/avatar";
import ThreadCard from "../../../components/thread-card";
import Link from "next/link";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfileById(id);
  if (!profile) notFound();

  const [threads, reputation] = await Promise.all([
    getThreadsByAuthor(profile.id),
    getReputationByProfile(profile.id),
  ]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Profile header */}
      <div className="flex items-start gap-6">
        <Avatar name={profile.display_name} size="lg" />
        <div>
          <h1 className="text-2xl font-semibold">
            {profile.display_name || profile.username}
          </h1>
          <p className="text-sm text-muted">@{profile.username}</p>
          {profile.bio && (
            <p className="mt-2 text-sm leading-relaxed">{profile.bio}</p>
          )}
          {profile.rac_score > 0 && (
            <p className="mt-2 text-sm font-medium text-accent">
              RaC {profile.rac_score}
            </p>
          )}
        </div>
      </div>

      {/* Reputation breakdown */}
      {reputation.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Reputation</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {reputation.map((r) => (
              <Link
                key={r.community_id}
                href={`/community/${r.community?.slug}`}
                className="rounded-xl border border-border p-3 hover:bg-surface-hover transition-colors"
              >
                <p className="text-sm font-medium truncate">
                  {r.community?.name}
                </p>
                <p className="text-lg font-semibold text-accent">{r.score}</p>
                <p className="text-xs text-muted">
                  {r.answers_accepted} accepted
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* User's threads */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Posts</h2>
        {threads.length === 0 ? (
          <p className="text-muted text-center py-8">No posts yet.</p>
        ) : (
          <div className="space-y-4">
            {threads.map((t) => (
              <ThreadCard key={t.id} thread={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
