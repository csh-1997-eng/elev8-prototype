import { Comment } from "@/lib/types";
import Avatar from "./avatar";
import AnswerVoteButtons from "./answer-vote-buttons";
import AcceptAnswerButton from "./accept-answer-button";

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
  threadId,
  threadAuthorId,
}: {
  comment: Comment;
  isReply?: boolean;
  threadId?: string;
  threadAuthorId?: string;
}) {
  return (
    <div className={`flex gap-3 ${isReply ? "ml-10" : ""} ${comment.is_accepted ? "rounded-xl border border-green-500/20 bg-green-500/5 p-3 -m-3" : ""}`}>
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
          {comment.is_accepted && (
            <span className="text-xs font-medium text-green-500">Accepted</span>
          )}
        </div>
        <p className="text-sm leading-relaxed">{comment.body}</p>
        <div className="mt-2 flex items-center gap-3">
          <AnswerVoteButtons answerId={comment.id} initialScore={comment.upvotes} />
          {threadId && threadAuthorId && (
            <AcceptAnswerButton
              answerId={comment.id}
              threadId={threadId}
              threadAuthorId={threadAuthorId}
              isAccepted={comment.is_accepted}
            />
          )}
        </div>
      </div>
    </div>
  );
}
