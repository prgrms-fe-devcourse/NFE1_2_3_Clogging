// 게시물 관련 쿼리

import { useQuery } from '@tanstack/react-query';

// 게시물 목록 쿼리
export const useGetPosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then((res) => res.json()),
  });
};

// 게시물 상세 쿼리
export const useGetPost = (id: string) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => fetch(`/api/posts/${id}`).then((res) => res.json()),
  });
};
