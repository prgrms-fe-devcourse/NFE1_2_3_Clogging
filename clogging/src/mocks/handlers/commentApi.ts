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

export const commentApi = {
  getComments: async (postId: string): Promise<Comment[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const comments = getStoredComments();
    return comments.filter((c) => c.postId === postId);
  },

  createComment: async (
    comment: Omit<Comment, 'id' | 'createdAt'>,
  ): Promise<Comment> => {
    const comments = getStoredComments();
    const newComment: Comment = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...comment,
    };

    comments.push(newComment);
    saveComments(comments);
    await new Promise((resolve) => setTimeout(resolve, 500));

    return newComment;
  },

  updateComment: async (
    comment: Partial<Comment> & { id: string },
  ): Promise<Comment> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const comments = getStoredComments();
    const index = comments.findIndex((c) => c.id === comment.id);
    if (index === -1) throw new Error('댓글을 찾을 수 없습니다.');

    const updatedComment = {
      ...comments[index],
      ...comment,
    };
    comments[index] = updatedComment;
    saveComments(comments);

    return updatedComment;
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const comments = getStoredComments();
    const index = comments.findIndex((c) => c.id === commentId);
    if (index === -1) throw new Error('댓글을 찾을 수 없습니다.');

    comments.splice(index, 1);
    saveComments(comments);
  },
  
  getComment: async (commentId: string): Promise<Comment> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const comments = getStoredComments();
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) throw new Error('댓글을 찾을 수 없습니다.');
    return comment;
  }
};
