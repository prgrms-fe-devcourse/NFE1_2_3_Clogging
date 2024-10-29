'use client';

import { useState } from 'react';
import { useComments, useDeleteComment, useUpdateComment } from '../hooks';
import { Button } from '@/shared/ui/common/Button';
import { Comment } from '../types';
import { Textarea } from '@/shared/ui/Form/Form';

export const List = ({ postId }: { postId: string }) => {
  const { data: comments, isLoading } = useComments(postId);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  if (isLoading) return <div>댓글을 불러오는 중...</div>;

  if (!comments?.length) {
    return <div className="text-gray-500">아직 댓글이 없습니다.</div>;
  }

  const handleEdit = (commentId: string) => {
    const comment = comments.find((c: Comment) => c.id === commentId);
    if (!comment) return;

    const password = prompt('댓글 수정을 위해 비밀번호를 입력해주세요.');
    if (!password) return;

    if (password !== comment.password) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setEditingContent(comment.content);
    setEditingCommentId(commentId);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  const handleEditSubmit = async (commentId: string) => {
    const comment = comments.find((c: Comment) => c.id === commentId);
    if (!comment) return;

    try {
      await updateComment.mutateAsync({
        id: commentId,
        postId,
        content: editingContent,
      });
      handleEditCancel();
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert('수정에 실패했습니다.');
    }
  };

  const handleDelete = async (commentId: string) => {
    const comment = comments.find((c: Comment) => c.id === commentId);
    if (!comment) return;

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
    <div className="space-y-4">
      {comments?.map((comment: Comment) => (
        <div key={comment.id} className="p-4 border rounded">
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
              <Button
                variant="secondary"
                onClick={() => handleEdit(comment.id)}
              >
                수정
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDelete(comment.id)}
              >
                삭제
              </Button>
            </div>
          </div>
          {editingCommentId === comment.id ? (
            <div className="space-y-2">
              <Textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => handleEditSubmit(comment.id)}>
                  수정 완료
                </Button>
                <Button variant="outline" onClick={handleEditCancel}>
                  취소
                </Button>
              </div>
            </div>
          ) : (
            <p>
              {comment.isPrivate ? '비공개 댓글입니다.' : comment.content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
