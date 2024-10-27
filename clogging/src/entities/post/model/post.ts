'use client';

import { useQuery } from '@tanstack/react-query';
import { postApi } from '../api/postApi';

export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => postApi.getPost(postId),
  });
};

export const useAdjacentPosts = (currentPostId: string) => {
  return useQuery({
    queryKey: ['adjacentPosts', currentPostId],
    queryFn: () => postApi.getAdjacentPosts(currentPostId),
  });
};
