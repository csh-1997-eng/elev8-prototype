import Link from "next/link";
import { Community } from "@/lib/types";

export default function CommunityCard({ community }: { community: Community }) {
  return (
    <Link
      href={`/community/${community.slug}`}
      className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-surface hover:bg-surface-hover transition-colors"
    >
      {/* Icon circle */}
      <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-semibold flex items-center justify-center text-sm shrink-0">
        {community.name[0]}
      </div>
      <div className="min-w-0">
        <p className="font-medium truncate">{community.name}</p>
        <p className="text-xs text-muted">
          {community.member_count.toLocaleString()} members
        </p>
      </div>
    </Link>
  );
}
