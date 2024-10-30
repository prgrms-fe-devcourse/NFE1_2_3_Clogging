'use client';

import { useEffect } from 'react';
import {
  useComments,
  useUpdateComment,
  useDeleteComment,
} from '../lib/hooks/useComments';
import { CommentItem } from './CommentItem';
import { CommentWithReplies } from '../types';
import { useCommentListStore } from '../lib/store/useCommentListStore';

export const CommentList = ({ postId }: { postId: string }) => {
  const { data: comments, isLoading } = useComments(postId);
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

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

  // 관리자 상태 체크
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

    if (comment.nickname === '관리자' || isAdmin) {
      setEditingComment(commentId, comment.content, comment.isPrivate);
      return;
    }

    const password = prompt('댓글 수정을 위해 비밀번호를 입력해주세요.');
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

    try {
      await updateComment.mutateAsync({
        id: commentId,
        postId,
        content: editingContent,
        isPrivate: editingIsPrivate,
        nickname: comment.nickname,
        password: comment.password,
      });
      resetEditingState();
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert('수정에 실패했습니다.');
    }
  };

  const handleDelete = async (commentId: string) => {
    const comment = findComment(comments, commentId);
    if (!comment) return;

    if (comment.nickname === '관리자' || isAdmin) {
      const confirmDelete = window.confirm(
        '정말로 이 댓글을 삭제하시겠습니까?',
      );
      if (!confirmDelete) return;

      try {
        await deleteComment.mutateAsync({
          postId,
          commentId,
          password: '',
        });
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
        alert('삭제에 실패했습니다.');
      }
      return;
    }

    const password = prompt('댓글 삭제를 위해 비밀번호를 입력해주세요.');
    if (!password) return;

    if (password !== comment.password) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await deleteComment.mutateAsync({
        postId,
        commentId,
        password,
      });
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('삭제 권한이 없습니다.');
    }
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
          onEditContentChange={(content: any) =>
            setEditingComment(editingCommentId, content, editingIsPrivate)
          }
          onEditPrivateChange={(isPrivate: any) =>
            setEditingComment(editingCommentId, editingContent, isPrivate)
          }
          onEditSubmit={handleEditSubmit}
          onEditCancel={resetEditingState}
          replyingToId={replyingToId}
          onReplySuccess={() => setReplyingTo(null)}
          onReplyCancel={() => setReplyingTo(null)}
          postId={postId}
        />
      ))}
    </div>
  );
};
