import { CommentWithReplies } from '../types';

export const findParentComment = (
  commentId: string,
  comments: CommentWithReplies[],
): CommentWithReplies | undefined => {
  const parentComment = comments?.find((comment) =>
    comment.replies?.some((reply) => reply.id === commentId),
  );

  if (!parentComment) {
    throw new Error('부모 댓글을 찾을 수 없습니다.');
  }

  return parentComment;
};
