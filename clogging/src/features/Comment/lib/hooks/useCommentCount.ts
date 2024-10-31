'use client';
import { useQuery } from '@tanstack/react-query';

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
