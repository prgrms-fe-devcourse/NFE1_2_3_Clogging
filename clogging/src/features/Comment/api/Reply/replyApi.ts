export const replyApi = {
  // 답글 생성 (Create Reply)
  createReply: async (params: {
    postId: string;
    commentId: string;
    replyId: string;
    content: string;
    password: string;
    isPrivate: boolean;
    author: string;
  }): Promise<Comment> => {
    try {
      const response = await fetch('/api/comments/replies/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '답글 작성 실패!');
      }

      return data.params;
    } catch (error) {
      console.error('답글 생성 에러:', error);
      throw error;
    }
  },

  // 답글 수정 (Update Reply)
  updateReply: async (params: {
    postId: string;
    commentId: string;
    replyId: string;
    content: string;
    password: string;
    isPrivate?: boolean;
    author?: string;
  }) => {
    try {
      const {
        postId,
        commentId,
        replyId,
        content,
        password,
        isPrivate,
        author,
      } = params;
      const response = await fetch(
        `/api/comments/replies/update?postId=${postId}&commentId=${commentId}&replyId=${replyId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content,
            password,
            isPrivate,
            author,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '답글 수정 실패!');
      }

      return data.reply;
    } catch (error) {
      console.error('답글 수정 에러:', error);
      throw error;
    }
  },

  // 답글 삭제 (Delete Reply)
  deleteReply: async (params: {
    postId: string;
    commentId: string;
    replyId: string;
    password: string;
  }): Promise<void> => {
    try {
      const { postId, commentId, replyId, password } = params;
      const response = await fetch(
        `/api/comments/replies/${replyId}/delete?postId=${postId}&commentId=${commentId}&replyId=${replyId}&password=${password}`,
        {
          method: 'DELETE',
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '답글 삭제 실패!');
      }
    } catch (error) {
      console.error('답글 삭제 에러:', error);
      throw error;
    }
  },
};
