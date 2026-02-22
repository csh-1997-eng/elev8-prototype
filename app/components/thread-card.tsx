import Link from "next/link";
import { Thread } from "@/lib/types";
import Avatar from "./avatar";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 30) return `${Math.floor(days / 30)}mo ago`;
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours}h ago`;
  return "just now";
}

export default function ThreadCard({ thread }: { thread: Thread }) {
  return (
    <Link
      href={`/thread/${thread.id}`}
      className="block p-6 rounded-2xl border border-border bg-surface hover:bg-surface-hover transition-colors"
    >
      {/* Community + Author header */}
      <div className="flex items-center gap-2 mb-3">
        {thread.community && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent">
            {thread.community.name}
          </span>
        )}
        <span className="text-xs text-muted">
          {timeAgo(thread.created_at)}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-2 leading-snug">
        {thread.title}
      </h3>

      {/* Body preview */}
      {thread.body && (
        <p className="text-sm text-muted line-clamp-2 mb-4">{thread.body}</p>
      )}

      {/* Footer: author + stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar
            name={thread.author?.display_name || null}
            url={thread.author?.avatar_url}
            size="sm"
          />
          <span className="text-sm text-muted">
            {thread.author?.display_name || thread.author?.username}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
            {thread.upvotes}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
            </svg>
            {thread.comment_count}
          </span>
        </div>
      </div>
    </Link>
  );
}
