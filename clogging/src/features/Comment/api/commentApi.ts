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
    console.log('수정 요청 데이터:', comment); // 요청 데이터 확인
    try {
      const response = await fetch(
        `/api/comments/update?postId=${comment.postId}&commentId=${comment.commentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postId: comment.postId, // postId 추가
            commentId: comment.commentId, // commentId 추가
            content: comment.content, // content 필수
            password: comment.password, // password 필수
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '댓글 수정 실패');
      }

      const data = await response.json();
      return data.comment;
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
