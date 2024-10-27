import { mockPosts } from '@/mocks/data/posts';
import { Post } from '@/features/Post/types';

export const postApi = {
  getPost: async (postId: string): Promise<Post> => {
    const post = mockPosts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    // 실제 API 호출을 시뮬레이션하기 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 500));

    return post;
  },

  getAdjacentPosts: async (
    currentPostId: string,
  ): Promise<{ prev: Post | null; next: Post | null }> => {
    const currentIndex = mockPosts.findIndex((p) => p.id === currentPostId);

    return {
      prev: currentIndex > 0 ? mockPosts[currentIndex - 1] : null,
      next:
        currentIndex < mockPosts.length - 1
          ? mockPosts[currentIndex + 1]
          : null,
    };
  },
};
