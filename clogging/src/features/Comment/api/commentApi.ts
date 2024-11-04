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
  updateComment: async (comment: {
    postId: string;
    commentId: string;
    content: string;
    password: string;
    isPrivate?: boolean;
    author?: string;
  }): Promise<Comment> => {
    try {
      const response = await fetch(
        `/api/comments/update?postId=${comment.postId}&commentId=${comment.commentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(comment),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '댓글 수정 실패');
      }

      return data;
    } catch (error) {
      console.error('댓글 수정 에러:', error);
      throw error;
    }
  },

  // 댓글 삭제 (Delete)
  deleteComment: async (data: {
    postId: string;
    commentId: string;
    password: string;
  }): Promise<void> => {
    try {
      const response = await fetch(
        `/api/comments/[id]/delete?postId=${data.postId}&commentId=${data.commentId}&password=${data.password}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || '댓글 삭제 실패');
      }
    } catch (error) {
      console.error('댓글 삭제 에러:', error);
      throw error;
    }
  },
};
