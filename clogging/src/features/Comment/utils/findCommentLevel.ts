import { CommentWithReplies } from '../types';

export const findCommentLevel = (
  commentId: string,
  comments: CommentWithReplies[],
): number => {
  // 최상위 댓글인 경우
  const isTopLevel = comments?.find((c) => c.id === commentId);
  if (isTopLevel) return 0;
  // 답글인 경우
  if (comments) {
    for (const comment of comments) {
      const reply = comment.replies?.find((r) => r.id === commentId);
      if (reply) return 1;
    }
  }
  return 0;
};
