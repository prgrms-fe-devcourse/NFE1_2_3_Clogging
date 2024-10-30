'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/common/Button';
import { Comment } from '../types';
import { Textarea } from '@/shared/ui/Form/Form';
import { Form } from './Form';
import { useAuth } from '@/features/Auth/hooks';
import {
  useComments,
  useUpdateComment,
  useDeleteComment,
} from '../lib/hooks/useComments';
import { elapsedTime } from '@/shared/lib/utils/elapsedTimeCalculation';
import { Card } from '@/shared/ui/common/Card';

interface CommentWithReplies extends Omit<Comment, 'replies'> {
  replies?: CommentWithReplies[];
}

interface commentItemProps {
  comment: CommentWithReplies;
  level?: number;
  onEdit: (commentId: string) => void;
  onDelete: (commentId: string) => Promise<void>;
  onReply: (commentId: string) => void;
  editingCommentId: string | null;
  editingContent: string;
  editingIsPrivate: boolean;
  onEditContentChange: (content: string) => void;
  onEditPrivateChange: (isPrivate: boolean) => void;
  onEditSubmit: (commentId: string) => Promise<void>;
  onEditCancel: () => void;
  replyingToId: string | null;
  onReplySuccess: () => void;
  onReplyCancel: () => void;
  postId: string;
}

const CommentItem = ({
  comment,
  level = 0,
  onEdit,
  onDelete,
  onReply,
  editingCommentId,
  editingContent,
  editingIsPrivate,
  onEditContentChange,
  onEditPrivateChange,
  onEditSubmit,
  onEditCancel,
  replyingToId,
  onReplySuccess,
  onReplyCancel,
  postId,
}: commentItemProps) => {
  const isEditing = editingCommentId === comment.id;
  const isReplying = replyingToId === comment.id;
  const { isAdmin } = useAuth();
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className="comment-thread">
      {/* 댓글 카드 */}
      <div
        className={`
          relative 
          ${level > 0 ? 'ml-4 pl-4 border-l border-gray-200' : ''}
        `}
      >
        {/* 댓글 내용 */}
        <div
          className={`p-4 rounded-lg ${level > 0 ? 'bg-gray-50' : 'bg-white'} border`}
        >
          {/* 댓글 헤더 */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold">{comment.nickname}</span>
              {comment.isAuthor && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-sm rounded">
                  작성자
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <time className="text-sm text-gray-500">
                {elapsedTime(comment.createdAt)}
              </time>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(comment.id)}
              >
                수정
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(comment.id)}
              >
                삭제
              </Button>
              {level === 0 && ( // 최상위 댓글에만 답글 버튼 표시
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onReply(comment.id)}
                >
                  답글
                </Button>
              )}
            </div>
          </div>

          {/* 댓글 내용 */}
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editingContent}
                onChange={(e) => onEditContentChange(e.target.value)}
              />
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id={`isPrivate-${comment.id}`}
                  checked={editingIsPrivate}
                  onChange={(e) => {
                    onEditPrivateChange(e.target.checked);
                    console.log('비공개 설정 변경:', e.target.checked); // 상태 변경 디버깅
                  }}
                  className="rounded border-gray-300"
                />
                <label
                  htmlFor={`isPrivate-${comment.id}`}
                  className="text-sm text-gray-600"
                >
                  댓글 {editingIsPrivate ? '비공개' : '공개'}{' '}
                  {/* 현재 상태 표시 */}
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEditSubmit(comment.id)}
                >
                  수정 완료
                </Button>
                <Button variant="outline" size="sm" onClick={onEditCancel}>
                  취소
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-800">
              {comment.isPrivate && !isAdmin
                ? '비공개 댓글입니다.'
                : comment.content}
            </p>
          )}
        </div>

        {/* 답글 작성 폼 */}
        {isReplying && (
          <Card className="mt-4 ml-4 border">
            <Form
              postId={postId}
              onSuccess={onReplySuccess}
              mode="create"
              parentCommentId={comment.id}
              defaultNickname={isAdmin ? '관리자' : ''}
              hideFields={isAdmin}
              defaultIsPrivate={false}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={onReplyCancel}
              className="mt-2"
            >
              취소
            </Button>
          </Card>
        )}

        {/* 답글 목록 */}
        {hasReplies && (
          <div className="mt-2 space-y-2">
            {comment.replies
              ?.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  level={level + 1}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onReply={onReply}
                  editingCommentId={editingCommentId}
                  editingContent={editingContent}
                  editingIsPrivate={editingIsPrivate}
                  onEditContentChange={onEditContentChange}
                  onEditPrivateChange={onEditPrivateChange}
                  onEditSubmit={onEditSubmit}
                  onEditCancel={onEditCancel}
                  replyingToId={replyingToId}
                  onReplySuccess={onReplySuccess}
                  onReplyCancel={onReplyCancel}
                  postId={postId}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const List = ({ postId }: { postId: string }) => {
  const { data: comments, isLoading } = useComments(postId);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [editingIsPrivate, setEditingIsPrivate] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  useEffect(() => {
    const adminStatus = localStorage.getItem('userRole') === 'admin';
    setIsAdmin(adminStatus);
  }, []);

  if (isLoading) return <div>댓글을 불러오는 중...</div>;

  if (!comments?.length) {
    return <div className="text-gray-500">아직 댓글이 없습니다.</div>;
  }

  // 댓글을 트리 구조로 구성
  const organizedComments = comments;

  const handleEdit = (commentId: string) => {
    const findComment = (
      comments: CommentWithReplies[],
    ): CommentWithReplies | undefined => {
      for (const comment of comments) {
        if (comment.id === commentId) return comment;
        if (comment.replies) {
          const found = findComment(comment.replies);
          if (found) return found;
        }
      }
      return undefined;
    };

    const comment = findComment(organizedComments);
    if (!comment) return;

    // 관리자가 작성한 댓글이거나 현재 사용자가 관리자인 경우 비밀번호 확인 없이 수정
    if (comment.nickname === '관리자' || isAdmin) {
      setEditingContent(comment.content);
      setEditingIsPrivate(comment.isPrivate);
      setEditingCommentId(commentId);
      return;
    }

    const password = prompt('댓글 수정을 위해 비밀번호를 입력해주세요.');
    if (!password) return;

    if (password !== comment.password) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setEditingContent(comment.content);
    setEditingIsPrivate(comment.isPrivate);
    setEditingCommentId(commentId);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditingContent('');
    setEditingIsPrivate(false);
  };

  const handleEditSubmit = async (commentId: string) => {
    const findComment = (
      comments: CommentWithReplies[],
    ): CommentWithReplies | undefined => {
      for (const comment of comments) {
        if (comment.id === commentId) return comment;
        if (comment.replies) {
          const found = findComment(comment.replies);
          if (found) return found;
        }
      }
      return undefined;
    };

    const comment = findComment(organizedComments);
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
      handleEditCancel();
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert('수정에 실패했습니다.');
    }
  };

  const handleDelete = async (commentId: string) => {
    const findComment = (
      comments: CommentWithReplies[],
    ): CommentWithReplies | undefined => {
      for (const comment of comments) {
        if (comment.id === commentId) return comment;
        if (comment.replies) {
          const found = findComment(comment.replies);
          if (found) return found;
        }
      }
      return undefined;
    };

    const comment = findComment(organizedComments);
    if (!comment) return;

    // 관리자가 작성한 댓글이거나 현재 사용자가 관리자인 경우 비밀번호 확인 없이 삭제
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

  const handleReplyClick = (commentId: string) => {
    setReplyingToId(commentId);
  };

  const handleReplyCancel = () => {
    setReplyingToId(null);
  };

  const handleReplySuccess = () => {
    setReplyingToId(null);
  };

  return (
    <div className="space-y-6">
      {organizedComments.map((comment: CommentWithReplies) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReply={handleReplyClick}
          editingCommentId={editingCommentId}
          editingContent={editingContent}
          editingIsPrivate={editingIsPrivate}
          onEditContentChange={setEditingContent}
          onEditPrivateChange={setEditingIsPrivate}
          onEditSubmit={handleEditSubmit}
          onEditCancel={handleEditCancel}
          replyingToId={replyingToId}
          onReplySuccess={handleReplySuccess}
          onReplyCancel={handleReplyCancel}
          postId={postId}
        />
      ))}
    </div>
  );
};
