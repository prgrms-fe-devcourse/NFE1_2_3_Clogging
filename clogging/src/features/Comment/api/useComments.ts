import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Comment } from '../types';
import { commentApi } from '@/features/Comment/api/commentApi';
import { useInvalidateQuery } from '@/shared/lib/hooks/useInvalidateQuery';

// 댓글 목록 조회
export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentApi.getComments(postId),
    staleTime: 1000 * 60, // 1분
    refetchOnWindowFocus: true,
  });
};

// 댓글 생성
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: Omit<Comment, 'id' | 'createdAt'>) =>
      commentApi.createComment(comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.postId],
      });
    },
  });
};

// 댓글 수정
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      postId: string;
      commentId: string;
      content: string; // 필수
      password: string; // 필수
      isPrivate?: boolean;
      author?: string;
    }) => commentApi.updateComment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.postId],
      });
    },
  });
};

// 댓글 삭제
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      commentId,
      password,
      isAdmin,
    }: {
      postId: string;
      commentId: string;
      password: string;
      isAdmin?: boolean;
    }) => commentApi.deleteComment({ postId, commentId, password }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.postId],
      });
    },
  });
};

// 단일 댓글 조회 훅 (필요한 경우)
export const useComment = (commentId: string) => {
  return useQuery({
    queryKey: ['comment', commentId],
    queryFn: () => commentApi.getComment(commentId),
    enabled: !!commentId,
  });
};

// 댓글 목록을 무효화
export const useInvalidateComments = (postId: string) => {
  return useInvalidateQuery(['comments', postId]);
};
