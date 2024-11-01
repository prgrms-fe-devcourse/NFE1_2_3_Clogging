'use client';

import { useEffect } from 'react';
import {
  useComments,
  useUpdateComment,
  useDeleteComment,
} from '../api/useComments';
import { useUpdateReply, useDeleteReply } from '../api/Reply/useReply';
import { CommentItem } from './CommentItem';
import { CommentWithReplies } from '../types';
import { useCommentListStore } from '../lib/stores/useCommentListStore';

export const CommentList = ({ postId }: { postId: string }) => {
  const { data: comments, isLoading } = useComments(postId);
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();
  const updateReply = useUpdateReply();
  const deleteReply = useDeleteReply();

  const {
    editingCommentId,
    editingContent,
    editingIsPrivate,
    replyingToId,
    isAdmin,
    setEditingComment,
    setReplyingTo,
    setIsAdmin,
    resetEditingState,
    findComment,
  } = useCommentListStore();

  useEffect(() => {
    const adminStatus = localStorage.getItem('userRole') === 'admin';
    setIsAdmin(adminStatus);
  }, [setIsAdmin]);

  if (isLoading) return <div>댓글을 불러오는 중...</div>;
  if (!comments?.length) {
    return <div className="text-gray-500">아직 댓글이 없습니다.</div>;
  }

  const handleEdit = (commentId: string) => {
    const comment = findComment(comments, commentId);
    if (!comment) return;

    if (comment.author === '관리자' || isAdmin) {
      setEditingComment(commentId, comment.content, comment.isPrivate);
      return;
    }

    const password = prompt('비밀번호를 입력해주세요.');
    if (!password) return;

    if (password !== comment.password) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setEditingComment(commentId, comment.content, comment.isPrivate);
  };

  const handleEditSubmit = async (commentId: string) => {
    const comment = findComment(comments, commentId);
    if (!comment) return;

    // CommentItem에서 받은 댓글이 몇 번째 depth인지 찾기
    const findCommentLevel = (commentId: string): number => {
      // 최상위 댓글인 경우
      const isTopLevel = comments.find((c) => c.id === commentId);
      if (isTopLevel) return 0;

      // 답글인 경우
      for (const comment of comments) {
        const reply = comment.replies?.find((r) => r.id === commentId);
        if (reply) return 1;
      }
      return 0;
    };

    const level = findCommentLevel(commentId);
    console.log('댓글/답글 레벨:', level);

    try {
      if (level > 0) {
        // 답글인 경우
        // 부모 댓글 ID 찾기
        const parentComment = comments.find((comment) =>
          comment.replies?.some((reply) => reply.id === commentId),
        );

        if (!parentComment) {
          throw new Error('부모 댓글을 찾을 수 없습니다.');
        }

        // 답글 수정
        await updateReply.mutateAsync({
          postId,
          commentId: parentComment.id, // 부모 댓글 ID
          replyId: commentId, // 현재 답글 ID
          content: editingContent,
          password: comment.password,
        });
      } else {
        // 일반 댓글인 경우
        await updateComment.mutateAsync({
          commentId,
          postId,
          content: editingContent,
          password: comment.password,
          isPrivate: editingIsPrivate,
        });
      }
      resetEditingState();
    } catch (error) {
      console.error('수정 실패:', error);
      alert('수정에 실패했습니다.');
    }
  };

  const handleDelete = async (commentId: string) => {
    const comment = findComment(comments, commentId);
    if (!comment) return;

    // CommentItem에서 받은 댓글이 몇 번째 depth인지 찾기
    const findCommentLevel = (commentId: string): number => {
      const isTopLevel = comments.find((c) => c.id === commentId);
      if (isTopLevel) return 0;

      for (const comment of comments) {
        const reply = comment.replies?.find((r) => r.id === commentId);
        if (reply) return 1;
      }
      return 0;
    };

    const level = findCommentLevel(commentId);

    if (comment.author === '관리자' || isAdmin) {
      const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
      if (!confirmDelete) return;

      try {
        if (level > 0) {
          // 답글 삭제
          const parentComment = comments.find((comment) =>
            comment.replies?.some((reply) => reply.id === commentId),
          );

          if (!parentComment) {
            throw new Error('부모 댓글을 찾을 수 없습니다.');
          }

          await deleteReply.mutateAsync({
            postId,
            commentId: parentComment.id,
            replyId: commentId,
            password: comment.password,
          });
        } else {
          // 일반 댓글 삭제
          await deleteComment.mutateAsync({
            postId,
            commentId,
            password: comment.password,
          });
        }
      } catch (error) {
        console.error('삭제 실패:', error);
        alert('삭제에 실패했습니다.');
      }
      return;
    }

    const password = prompt('삭제를 위해 비밀번호를 입력해주세요.');
    if (!password) return;

    if (password !== comment.password) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      if (level > 0) {
        // 답글 삭제
        const parentComment = comments.find((comment) =>
          comment.replies?.some((reply) => reply.id === commentId),
        );

        if (!parentComment) {
          throw new Error('부모 댓글을 찾을 수 없습니다.');
        }

        await deleteReply.mutateAsync({
          postId,
          commentId: parentComment.id,
          replyId: commentId,
          password,
        });
      } else {
        // 일반 댓글 삭제
        await deleteComment.mutateAsync({
          postId,
          commentId,
          password,
        });
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제 권한이 없습니다.');
    }
  };

  const handleReplySuccess = () => {
    setReplyingTo(null);
  };

  return (
    <div className="space-y-6">
      {comments.map((comment: CommentWithReplies) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReply={setReplyingTo}
          editingCommentId={editingCommentId}
          editingContent={editingContent}
          editingIsPrivate={editingIsPrivate}
          onEditContentChange={(content: string) =>
            setEditingComment(editingCommentId, content, editingIsPrivate)
          }
          onEditPrivateChange={(isPrivate: boolean) =>
            setEditingComment(editingCommentId, editingContent, isPrivate)
          }
          onEditSubmit={handleEditSubmit}
          onEditCancel={resetEditingState}
          replyingToId={replyingToId}
          onReplySuccess={handleReplySuccess}
          onReplyCancel={() => setReplyingTo(null)}
          postId={postId}
        />
      ))}
    </div>
  );
};
