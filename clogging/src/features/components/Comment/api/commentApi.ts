import { mockComments } from '@/shared/api/mocks/comments';

export const commentApi = {
  getComments: async (postId: string): Promise<Comment[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockComments.filter((c) => c.postId === postId);
  },

  createComment: async (
    comment: Omit<Comment, 'id' | 'createdAt'>,
  ): Promise<Comment> => {
    const newComment: Comment = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...comment,
    };

    // 실제로는 mockComments에 추가하면 좋지만,
    // 메모리에만 저장되므로 페이지 새로고침시 사라집니다.
    await new Promise((resolve) => setTimeout(resolve, 500));

    return newComment;
  },
};
