import { CommunityReputation } from "@/lib/types";
import Avatar from "./avatar";
import Link from "next/link";

export default function CommunityLeaderboard({
  entries,
}: {
  entries: CommunityReputation[];
}) {
  if (entries.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border p-5">
      <h3 className="text-sm font-semibold mb-4">Top Contributors</h3>
      <div className="space-y-3">
        {entries.map((entry, index) => (
          <Link
            key={entry.profile_id}
            href={`/profile/${entry.profile_id}`}
            className="flex items-center gap-3 group"
          >
            <span className="text-xs font-medium text-muted w-5 text-right">
              {index + 1}
            </span>
            <Avatar
              name={entry.profile?.display_name || null}
              url={entry.profile?.avatar_url}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate group-hover:text-accent transition-colors">
                {entry.profile?.display_name || entry.profile?.username}
              </p>
            </div>
            <span className="text-xs font-medium text-accent">
              {entry.score}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
