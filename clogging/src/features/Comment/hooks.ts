'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentApi } from '../../mocks/handlers/commentApi';
import { useInvalidateQuery } from '@/shared/lib/hooks/useInvalidateQuery';

// 댓글 목록 조회
export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentApi.getComments(postId),
  });
};

// 댓글 생성
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

// 댓글 수정
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentApi.updateComment,
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
    }: {
      postId: string;
      commentId: string;
      password: string;
    }) => commentApi.deleteComment(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.postId],
      });
    },
  });
};

// 댓글 상세 조회
export const useComment = (commentId: string) => {
  return useQuery({
    queryKey: ['comment', commentId],
    queryFn: () => commentApi.getComment(commentId),
  });
};

// 댓글 목록을 무효화
export const useInvalidateComments = (postId: string) => {
  return useInvalidateQuery(['comments', postId]);
};
