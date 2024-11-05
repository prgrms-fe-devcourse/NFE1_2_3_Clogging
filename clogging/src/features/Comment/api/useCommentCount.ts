'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// 쿼리 키를 상수로 관리
export const COMMENT_QUERY_KEY = 'commentCount';

// 기존 댓글 수 조회 훅
export const useCommentCount = (postId: string) => {
  return useQuery({
    queryKey: [COMMENT_QUERY_KEY, postId],
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

// 댓글 수 갱신을 위한 훅
export const useInvalidateCommentCount = () => {
  const queryClient = useQueryClient();

  return (postId: string) => {
    queryClient.invalidateQueries({
      queryKey: [COMMENT_QUERY_KEY, postId],
    });
  };
};
