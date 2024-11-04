import { useQuery } from '@tanstack/react-query';
import { Post } from '@/features/Post/types';

interface SearchResponse {
  message: string;
  posts: Post[];
}

interface SearchParams {
  keyword?: string;
}

export const useSearch = (params: SearchParams) => {
  return useQuery<SearchResponse>({
    queryKey: ['search', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.keyword) searchParams.set('keyword', params.keyword);

      const response = await fetch(`/api/search?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error('검색에 실패했습니다.');
      }
      return response.json();
    },
    enabled: !!params.keyword,
    refetchOnWindowFocus: false, // 창 포커스시 재조회 비활성화
    staleTime: Infinity, // 데이터를 항상 fresh하게 유지
  });
};
