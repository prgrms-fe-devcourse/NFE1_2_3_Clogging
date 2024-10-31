import { Comment } from '@/features/Comment/types';

export const commentApi = {
  // 댓글 목록 조회 (Read)
  getComments: async (postId: string | number): Promise<Comment[]> => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '댓글 조회 실패');
      }

      console.log('댓글 목록 조회: ', data.comments);
      return data.comments || [];
    } catch (error) {
      console.error('댓글 조회 에러:', error);
      return [];
    }
  },

  // 댓글 생성 (Create)
  createComment: async (
    comment: Omit<Comment, 'id' | 'createdAt' | 'replies'>,
  ): Promise<Comment> => {
    try {
      const response = await fetch('/api/comments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '댓글 생성 실패');
      }

      return data.comment;
    } catch (error) {
      console.error('댓글 생성 에러:', error);
      throw error;
    }
  },

  // 댓글 수정 (Update)
  updateComment: async (
    comment: Partial<Comment> & { id: string },
  ): Promise<Comment> => {
    try {
      const response = await fetch('/api/comments/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '댓글 수정 실패');
      }

      return data.comment;
    } catch (error) {
      console.error('댓글 수정 에러:', error);
      throw error;
    }
  },

  // 댓글 삭제 (Delete)
  deleteComment: async (commentId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/comments/${commentId}/delete`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '댓글 삭제 실패');
      }
    } catch (error) {
      console.error('댓글 삭제 에러:', error);
      throw error;
    }
  },

  // 답글 생성 (Create Reply)
  createReply: async (
    parentId: string,
    reply: Omit<Comment, 'id' | 'createdAt' | 'replies'>,
  ): Promise<Comment> => {
    try {
      const response = await fetch('/api/comments/replies/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parentId, ...reply }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '답글 생성 실패');
      }

      return data.comment;
    } catch (error) {
      console.error('답글 생성 에러:', error);
      throw error;
    }
  },

  // 답글 수정 (Update Reply)
  updateReply: async (
    reply: Partial<Comment> & { id: string },
  ): Promise<Comment> => {
    try {
      const response = await fetch('/api/comments/replies/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reply),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '답글 수정 실패');
      }

      return data.comment;
    } catch (error) {
      console.error('답글 수정 에러:', error);
      throw error;
    }
  },

  // 답글 삭제 (Delete Reply)
  deleteReply: async (replyId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/comments/replies/${replyId}/delete`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '답글 삭제 실패');
      }
    } catch (error) {
      console.error('답글 삭제 에러:', error);
      throw error;
    }
  },
};
