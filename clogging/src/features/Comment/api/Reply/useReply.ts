import { useMutation, useQueryClient } from '@tanstack/react-query';
import { replyApi } from '@/features/Comment/api/Reply/replyApi';
import { Comment } from '../../types';

// 답글 생성
export const useCreateReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reply: {
      postId: string;
      commentId: string;
      author: string;
      content: string;
      password: string;
    }) => replyApi.createReply(reply),
    onSuccess: (_, variables) => {
      // 해당 게시물의 댓글 목록을 무효화
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

// 답글 목록 무효화 (필요한 경우)
export const useInvalidateReplies = (postId: string) => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: ['comments', postId],
    });
  };
};
