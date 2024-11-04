import { useMutation, useQueryClient } from '@tanstack/react-query';
import { replyApi } from '@/features/Comment/api/Reply/replyApi';

// 답글 생성
export const useCreateReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reply: {
      postId: string;
      replyId: string;
      commentId: string;
      author: string;
      content: string;
      password: string;
      isPrivate: boolean;
    }) => replyApi.createReply(reply),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.postId],
      });
    },
  });
};

// 답글 수정
export const useUpdateReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      postId: string;
      commentId: string;
      replyId: string;
      content: string;
      password: string;
      isPrivate?: boolean;
      author?: string;
    }) => replyApi.updateReply(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.postId],
      });
    },
  });
};

// 답글 삭제
export const useDeleteReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      postId: string;
      commentId: string;
      replyId: string;
      password: string;
    }) => replyApi.deleteReply(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.postId],
      });
    },
  });
};
