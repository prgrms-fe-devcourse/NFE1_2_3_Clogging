'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentApi } from '../../mocks/handlers/commentApi';

// 기존 코드 유지
export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentApi.getComments(postId),
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentApi.createComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.postId],
      });
    },
  });
};

// 여기서부터 추가된 부분 --------------------------------
// Comment/hooks.ts
export const useCommentCount = (postId: string) => {
  return useQuery({
    queryKey: ['commentCount', postId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/comments?postId=${postId}`);
        if (!response.ok) throw new Error('Failed to fetch comments');
        const data = await response.json();

        return data.comments.reduce((total: number, comment: any) => {
          return total + 1 + (comment.replies?.length || 0);
        }, 0);
      } catch (error) {
        return 0;
      }
    },
    staleTime: 30000, // 30초 동안 캐시 유지
    gcTime: 1000 * 60 * 5, // 5분 동안 캐시 보관
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 방지
    refetchOnMount: false, // 컴포넌트 마운트 시 재요청 방지
    enabled: !!postId, // postId가 있을 때만 요청 실행
  });
};
// 여기까지 추가된 부분 ---------------------------------
