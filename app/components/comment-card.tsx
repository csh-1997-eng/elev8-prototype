import { Comment } from "@/lib/types";
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

export default function CommentCard({
  comment,
  isReply = false,
}: {
  comment: Comment;
  isReply?: boolean;
}) {
  return (
    <div className={`flex gap-3 ${isReply ? "ml-10" : ""}`}>
      <Avatar
        name={comment.author?.display_name || null}
        url={comment.author?.avatar_url}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">
            {comment.author?.display_name || comment.author?.username}
          </span>
          <span className="text-xs text-muted">
            {timeAgo(comment.created_at)}
          </span>
        </div>
        <p className="text-sm leading-relaxed">{comment.body}</p>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
          {comment.upvotes}
        </div>
      </div>
    </div>
  );
}
