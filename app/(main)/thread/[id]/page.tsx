import { getThreadById, getCommentsByThread } from "@/lib/queries";
import { notFound } from "next/navigation";
import Avatar from "../../../components/avatar";
import CommentCard from "../../../components/comment-card";
import NewAnswerForm from "../../../components/new-answer-form";
import ClassificationVote from "../../../components/classification-vote";
import Link from "next/link";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 30) return `${Math.floor(days / 30)}mo ago`;
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours}h ago`;
  return "just now";
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const thread = await getThreadById(id);
  if (!thread) notFound();

  const comments = await getCommentsByThread(id);
  const topLevel = comments.filter((c) => !c.parent_id);
  const replies = comments.filter((c) => c.parent_id);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Thread header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          {thread.community && (
            <Link
              href={`/community/${thread.community.slug}`}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
            >
              {thread.community.name}
            </Link>
          )}
          <span className="text-xs px-2.5 py-1 rounded-full border border-border text-muted">
            {thread.thread_type}
          </span>
          {thread.status === "answered" && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 font-medium">
              Answered
            </span>
          )}
        </div>
        <h1 className="text-2xl font-semibold leading-snug mb-3">
          {thread.title}
        </h1>
        <div className="flex items-center gap-3 mb-4">
          <Avatar
            name={thread.author?.display_name || null}
            url={thread.author?.avatar_url}
            size="sm"
          />
          <div>
            <span className="text-sm font-medium">
              {thread.author?.display_name}
            </span>
            <span className="text-xs text-muted ml-2">
              {timeAgo(thread.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      {thread.body && (
        <p className="text-base leading-relaxed">{thread.body}</p>
      )}

      {/* Classification voting (only for questions) */}
      {thread.thread_type === "question" && (
        <div className="py-4 border-y border-border">
          <ClassificationVote
            threadId={id}
            currentType={thread.question_type}
            isLocked={thread.question_type_locked}
          />
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-6 py-4 border-y border-border text-sm text-muted">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
          {thread.upvotes} upvotes
        </span>
        <span>{comments.length} answers</span>
      </div>

      {/* Answers */}
      <div className="space-y-6">
        {topLevel.map((comment) => (
          <div key={comment.id} className="space-y-4">
            <CommentCard
              comment={comment}
              threadId={id}
              threadAuthorId={thread.author_id}
            />
            {replies
              .filter((r) => r.parent_id === comment.id)
              .map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  isReply
                  threadId={id}
                  threadAuthorId={thread.author_id}
                />
              ))}
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-muted text-center py-8">
            No answers yet. Be the first to share your thoughts.
          </p>
        )}
      </div>

      {/* Answer form */}
      <NewAnswerForm threadId={id} />
    </div>
  );
}
