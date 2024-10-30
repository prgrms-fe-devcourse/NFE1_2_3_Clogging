import { Comment } from '../../types';

export const organizeComments = (comments: Comment[]): Comment[] => {
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  // 먼저 모든 댓글을 map에 저장
  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // 부모-자식 관계 구성
  comments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id)!;

    if (comment.parentCommentId) {
      // 부모 댓글이 있는 경우
      const parentComment = commentMap.get(comment.parentCommentId);
      if (parentComment) {
        parentComment.replies?.push(commentWithReplies);
      }
    } else {
      // 최상위 댓글인 경우
      rootComments.push(commentWithReplies);
    }
  });

  return rootComments;
};
