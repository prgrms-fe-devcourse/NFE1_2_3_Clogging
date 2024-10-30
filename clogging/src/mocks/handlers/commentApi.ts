import { mockComments } from '@/mocks/data/comments';
import { Comment } from '@/features/Comment/types';

const STORAGE_KEY = 'mock_comments';

// 로컬 스토리지에서 댓글 가져오기
const getStoredComments = (): Comment[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : mockComments;
};

// 로컬 스토리지에 댓글 저장
const saveComments = (comments: Comment[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
};

// 댓글 ID로 댓글 찾기 (중첩된 replies 포함)
const findCommentById = (comments: Comment[], id: string): Comment | null => {
  for (const comment of comments) {
    if (comment.id === id) {
      return comment;
    }
    if (comment.replies?.length) {
      const found = findCommentById(comment.replies, id);
      if (found) return found;
    }
  }
  return null;
};

// 댓글 업데이트 함수 (중첩된 replies 포함)
const updateCommentInArray = (
  comments: Comment[],
  commentId: string,
  updateFn: (comment: Comment) => Comment,
): boolean => {
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].id === commentId) {
      comments[i] = updateFn(comments[i]);
      return true;
    }
    if (comments[i].replies?.length) {
      if (updateCommentInArray(comments[i].replies, commentId, updateFn)) {
        return true;
      }
    }
  }
  return false;
};

export const commentApi = {
  // 댓글 목록 조회
  getComments: async (postId: string): Promise<Comment[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const comments = getStoredComments();
    return comments.filter((c) => c.postId === postId);
  },

  // 댓글 생성
  createComment: async (
    comment: Omit<Comment, 'id' | 'createdAt' | 'replies'>,
  ): Promise<Comment> => {
    const comments = getStoredComments();
    const newComment: Comment = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...comment,
      isPrivate: Boolean(comment.isPrivate), // 명시적으로 boolean으로 변환
      replies: [],
    };

    // 부모 댓글이 있는 경우 (답글인 경우)
    if (comment.parentCommentId) {
      let parentFound = false;
      updateCommentInArray(
        comments,
        comment.parentCommentId,
        (parentComment) => {
          if (!parentComment.replies) {
            parentComment.replies = [];
          }
          parentComment.replies.push(newComment);
          parentFound = true;
          return parentComment;
        },
      );

      if (!parentFound) {
        throw new Error('부모 댓글을 찾을 수 없습니다.');
      }
    } else {
      // 최상위 댓글인 경우
      comments.push(newComment);
    }

    saveComments(comments);
    await new Promise((resolve) => setTimeout(resolve, 500));

    return newComment;
  },

  // 댓글 수정
  updateComment: async (
    comment: Partial<Comment> & { id: string },
  ): Promise<Comment> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const comments = getStoredComments();
    let updated = false;

    updateCommentInArray(comments, comment.id, (existingComment) => {
      updated = true;
      return {
        ...existingComment,
        ...comment,
        isPrivate: Boolean(comment.isPrivate), // 명시적으로 boolean으로 변환
        updatedAt: new Date().toISOString(),
      };
    });

    if (!updated) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }

    saveComments(comments);

    const updatedComment = findCommentById(comments, comment.id);
    if (!updatedComment) {
      throw new Error('업데이트된 댓글을 찾을 수 없습니다.');
    }

    return updatedComment;
  },

  // 댓글 삭제
  deleteComment: async (commentId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const comments = getStoredComments();
    let deleted = false;

    // 최상위 댓글에서 찾기
    const topLevelIndex = comments.findIndex((c) => c.id === commentId);
    if (topLevelIndex !== -1) {
      comments.splice(topLevelIndex, 1);
      deleted = true;
    } else {
      // 답글에서 찾기
      for (const comment of comments) {
        if (comment.replies?.length) {
          const replyIndex = comment.replies.findIndex(
            (r) => r.id === commentId,
          );
          if (replyIndex !== -1) {
            comment.replies.splice(replyIndex, 1);
            deleted = true;
            break;
          }
        }
      }
    }

    if (!deleted) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }

    saveComments(comments);
  },

  // 단일 댓글 조회
  getComment: async (commentId: string): Promise<Comment> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const comments = getStoredComments();
    const comment = findCommentById(comments, commentId);

    if (!comment) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }

    return comment;
  },
};
