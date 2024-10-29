'use client';

import { useState, useEffect } from 'react';
import { useComments, useDeleteComment, useUpdateComment } from '../hooks';
import { Button } from '@/shared/ui/common/Button';
import { Comment } from '../types';
import { Textarea } from '@/shared/ui/Form/Form';
import { Form } from './Form';

interface CommentWithReplies extends Omit<Comment, 'replies'> {
  replies?: CommentWithReplies[];
}

// 댓글을 트리 구조로 구성하는 함수
const organizeComments = (comments: Comment[]): CommentWithReplies[] => {
  const commentMap = new Map<string, CommentWithReplies>();
  const rootComments: CommentWithReplies[] = [];

  // 모든 댓글을 맵에 추가
  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // 부모-자식 관계 구성
  comments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id)!;
    if (comment.parentCommentId) {
      const parentComment = commentMap.get(comment.parentCommentId);
      if (parentComment) {
        if (!parentComment.replies) {
          parentComment.replies = [];
        }
        parentComment.replies.push(commentWithReplies);
      }
    } else {
      rootComments.push(commentWithReplies);
    }
  });

  return rootComments;
};

const CommentItem = ({
  comment,
  level = 0,
  onEdit,
  onDelete,
  onReply,
  isAdmin,
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
}: {
  comment: CommentWithReplies;
  level?: number;
  onEdit: (commentId: string) => void;
  onDelete: (commentId: string) => Promise<void>;
  onReply: (commentId: string) => void;
  isAdmin: boolean;
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
}) => {
  const isEditing = editingCommentId === comment.id;
  const isReplying = replyingToId === comment.id;

  return (
    <div className={`${level > 0 ? 'ml-8' : ''} mb-4`}>
      <div className={`p-4 border rounded ${level > 0 ? 'bg-gray-50' : ''}`}>
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
              {new Date(comment.createdAt).toLocaleDateString()}
            </time>
            <Button variant="secondary" onClick={() => onEdit(comment.id)}>
              수정
            </Button>
            <Button variant="outline" onClick={() => onDelete(comment.id)}>
              삭제
            </Button>
            {level === 0 && (
              <Button variant="secondary" onClick={() => onReply(comment.id)}>
                답글
              </Button>
            )}
          </div>
        </div>

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
                onChange={(e) => onEditPrivateChange(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label
                htmlFor={`isPrivate-${comment.id}`}
                className="text-sm text-gray-600"
              >
                댓글 비공개
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => onEditSubmit(comment.id)}
              >
                수정 완료
              </Button>
              <Button variant="outline" onClick={onEditCancel}>
                취소
              </Button>
            </div>
          </div>
        ) : (
          <p>
            {comment.isPrivate && !isAdmin
              ? '비공개 댓글입니다.'
              : comment.content}
          </p>
        )}
      </div>

      {/* 답글 작성 폼 */}
      {isReplying && (
        <div className="mt-2 ml-8">
          <Form
            postId={postId}
            onSuccess={onReplySuccess}
            mode="create"
            parentCommentId={comment.id}
            isAdmin={isAdmin}
            defaultNickname={isAdmin ? '관리자' : ''}
            hideFields={false} // 관리자여도 비공개 필드는 표시
          />
          <Button variant="outline" onClick={onReplyCancel} className="mt-2">
            취소
          </Button>
        </div>
      )}

      {/* 답글 목록 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies
            .sort(
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
                isAdmin={isAdmin}
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
  const organizedComments = organizeComments(comments);

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
          isAdmin: true,
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
    <div className="space-y-4">
      {organizedComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReply={handleReplyClick}
          isAdmin={isAdmin}
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
