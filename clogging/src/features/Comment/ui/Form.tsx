'use client';

import React, { useState } from 'react';
import { useCreateComment, useUpdateComment, useDeleteComment } from '../hooks';
import { Input } from '@/shared/ui/common/Input';
import { FormSectionItem, Textarea } from '@/shared/ui/Form/Form';
import { UserIcon } from 'lucide-react';
import { Button } from '@/shared/ui/common/Button';
import { Card } from '@/shared/ui/common/Card';

interface FormProps {
  postId: string;
  onSuccess: () => void;
  commentId?: string;
  initialData?: {
    nickname: string;
    content: string;
    isPrivate: boolean;
  };
  mode?: 'create' | 'edit';
  parentCommentId?: string;
  isAdmin?: boolean;
  defaultNickname?: string;
  hideFields?: boolean;
}

export const Form = ({
  postId,
  onSuccess,
  commentId,
  initialData,
  mode = 'create',
  parentCommentId,
  isAdmin,
  defaultNickname,
  hideFields,
}: FormProps) => {
  const createComment = useCreateComment();
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  const [form, setForm] = useState({
    nickname: isAdmin ? '작성자' : (initialData?.nickname || defaultNickname || ''),
    password: isAdmin ? 'admin' : '',
    content: initialData?.content || '',
    isPrivate: initialData?.isPrivate || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (createComment.isPending || updateComment.isPending) return;

    // 관리자가 아닌 경우에만 필수 필드 검증
    if (!isAdmin && (!form.nickname || !form.password || !form.content)) {
      alert('작성자, 비밀번호, 댓글 내용을 모두 입력해주세요.');
      return;
    }

    // 관리자인 경우 content만 검증
    if (isAdmin && !form.content) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      if (mode === 'create') {
        const response = await createComment.mutateAsync({
          postId,
          ...form,
          // 관리자인 경우 기본값 설정
          nickname: isAdmin ? '작성자' : form.nickname,
          password: isAdmin ? 'admin' : form.password,
          isAuthor: false,
          parentCommentId: parentCommentId || undefined,
          replies: [],
        });
        console.log('댓글 생성 성공:', response);
      } else {
        const response = await updateComment.mutateAsync({
          id: commentId!,
          postId,
          ...form,
        });
        console.log('댓글 수정 성공:', response);
      }

      setForm({
        nickname: isAdmin ? '작성자' : '',
        password: isAdmin ? 'admin' : '',
        content: '',
        isPrivate: false,
      });

      onSuccess();
    } catch (error: any) {
      console.error('댓글 작성/수정 실패:', {
        error,
        message: error.message,
        stack: error.stack,
        data: error.response?.data,
      });
      alert('댓글 작성/수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDelete = async () => {
    if (!commentId || (!isAdmin && !form.password)) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        await deleteComment.mutateAsync({ postId, commentId });
        onSuccess();
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
        alert('댓글 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card>
        <div className="space-y-6">
          {!hideFields && !isAdmin && (
            <div className="flex gap-6 items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                <UserIcon className="w-5 h-5 text-gray-500" />
              </div>
              <FormSectionItem
                title="닉네임"
                className="flex items-center gap-4"
              >
                <Input
                  type="text"
                  placeholder="닉네임을 입력하세요"
                  value={form.nickname}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, nickname: e.target.value }))
                  }
                  className="flex-1 p-2 border rounded"
                  required={!isAdmin}
                />
              </FormSectionItem>
              <FormSectionItem
                title="비밀번호"
                className="flex items-center gap-4"
              >
                <Input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="flex-1 p-2 border rounded"
                  required={!isAdmin}
                />
              </FormSectionItem>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, isPrivate: !prev.isPrivate }))
                }
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <span>댓글 비공개</span>
                {form.isPrivate ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}
          <div
            className="flex items-center justify-between gap-4"
            style={{ height: '90' }}
          >
            <Textarea
              placeholder="댓글을 입력하세요"
              value={form.content}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, content: e.target.value }))
              }
              className="flex-1 p-2 border rounded"
              rows={3}
              required
            />
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                className="h-12 px-6 whitespace-nowrap bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={createComment.isPending || updateComment.isPending}
              >
                {createComment.isPending || updateComment.isPending ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>처리 중...</span>
                  </div>
                ) : mode === 'create' ? (
                  '댓글 작성'
                ) : (
                  '댓글 수정'
                )}
              </Button>
              {mode === 'edit' && (
                <Button
                  type="button"
                  onClick={handleDelete}
                  className="h-12 px-6 whitespace-nowrap bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={deleteComment.isPending}
                >
                  {deleteComment.isPending ? '삭제 중...' : '댓글 삭제'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </form>
  );
};
