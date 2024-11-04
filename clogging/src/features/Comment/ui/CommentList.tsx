'use client';

import { useEffect, useCallback } from 'react';
import {
  useComments,
  useUpdateComment,
  useDeleteComment,
} from '../api/useComments';
import { useUpdateReply, useDeleteReply } from '../api/Reply/useReply';
import { CommentItem } from './CommentItem';
import { useCommentListStore } from '../lib/stores/useCommentListStore';
import { findCommentLevel } from '../utils/findCommentLevel';
import { findParentComment } from '../utils/findParentComment';
import { verifyPassword } from '../utils/verifyPassword';

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

  // 로그인 상태와 관리자 여부 확인
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setIsAdmin(userRole === 'admin');
  }, [setIsAdmin]);

  const handleReplySuccess = useCallback(() => {
    setReplyingTo(null);
  }, [setReplyingTo]);

  const handleEditContentChange = useCallback(
    (content: string) =>
      setEditingComment(editingCommentId, content, editingIsPrivate),
    [editingCommentId, editingIsPrivate, setEditingComment],
  );

  if (isLoading) return <div>댓글을 불러오는 중...</div>;

  if (!comments?.length) {
    return <div className="text-gray-500">아직 댓글이 없습니다.</div>;
  }

  const handleEdit = async (commentId: string) => {
    const comment = findComment(comments, commentId);
    if (!comment) return;

    if (isAdmin) {
      setEditingComment(commentId, comment.content, comment.isPrivate);
      return;
    }

    const isVerified = await verifyPassword(comment, '수정', isAdmin);
    if (!isVerified) return;

    setEditingComment(commentId, comment.content, comment.isPrivate);
  };

  const handleEditSubmit = async (commentId: string) => {
    const comment = findComment(comments, commentId);
    if (!comment) return;

    const level = findCommentLevel(commentId, comments);

    try {
      if (level > 0) {
        const parentComment = findParentComment(commentId, comments);
        if (!parentComment) {
          throw new Error('부모 댓글을 찾을 수 없습니다.');
        }

        await updateReply.mutateAsync({
          postId,
          commentId: parentComment.id,
          replyId: commentId,
          content: editingContent,
          password: comment.password,
          isPrivate: editingIsPrivate,
        });
      } else {
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
      alert(error instanceof Error ? error.message : '수정에 실패했습니다.');
    }
  };

  const handleDelete = async (commentId: string) => {
    const comment = findComment(comments, commentId);
    if (!comment) return;

    // 관리자일 경우 바로 삭제 가능
    if (isAdmin || (await verifyPassword(comment, '삭제', isAdmin))) {
      const level = findCommentLevel(commentId, comments);

      try {
        if (level > 0) {
          const parentComment = findParentComment(commentId, comments);
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
          await deleteComment.mutateAsync({
            postId,
            commentId,
            password: comment.password,
          });
        }
      } catch (error) {
        console.error('삭제 실패:', error);
        alert(error instanceof Error ? error.message : '삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReply={setReplyingTo}
          editingCommentId={editingCommentId}
          editingContent={editingContent}
          editingIsPrivate={editingIsPrivate}
          onEditContentChange={handleEditContentChange}
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
