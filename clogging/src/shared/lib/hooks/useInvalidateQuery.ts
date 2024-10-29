import { useQueryClient } from "@tanstack/react-query";

// 쿼리 무효화 훅
export const useInvalidateQuery = (queryKey: any[]) => {
  const queryClient = useQueryClient();

  // 쿼리를 무효화하는 함수
  const invalidateQuery = () => {
    queryClient.invalidateQueries({
      queryKey,
    });
  };

  return invalidateQuery;
};