'use client';

import { create } from 'zustand';
import { Post } from '@/features/Post/types';
import { useQuery } from '@tanstack/react-query';
import { postApi } from '@/mocks/handlers/postApi';
import { mockPosts } from '@/mocks/data/posts';

interface PostFilter {
  sortType: 'latest' | 'popular';
  posts: Post[];
  setSortType: (type: 'latest' | 'popular') => void;
  getSortedPosts: () => Post[];
}

// 단일 게시물 조회
export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => postApi.getPost(postId),
  });
};

// 이전/다음 게시물 조회
export const useAdjacentPosts = (currentPostId: string) => {
  return useQuery({
    queryKey: ['adjacentPosts', currentPostId],
    queryFn: () => postApi.getAdjacentPosts(currentPostId),
  });
};

export const usePostFilter = create<PostFilter>((set, get) => ({
  sortType: 'latest',
  posts: mockPosts, // 직접 mockPosts 사용
  setSortType: (type) => set({ sortType: type }),
  getSortedPosts: () => {
    const { posts, sortType } = get();
    const sorted = [...posts];

    if (sortType === 'latest') {
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
    } else {
      return sorted.sort((a, b) => b.viewCount - a.viewCount);
    }
  },
}));
