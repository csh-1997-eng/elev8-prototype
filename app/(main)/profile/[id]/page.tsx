import { getProfileById, getThreadsByAuthor } from "@/lib/queries";
import { notFound } from "next/navigation";
import Avatar from "../../../components/avatar";
import ThreadCard from "../../../components/thread-card";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfileById(id);
  if (!profile) notFound();

  const threads = await getThreadsByAuthor(profile.id);

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
        </div>
      </div>

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
