'use client';

import React, { useEffect } from 'react';
import { useCreateComment, useUpdateComment } from '../api/useComments';
import { Input } from '@/shared/ui/common/Input';
import { FormSectionItem } from '@/shared/ui/Form/Form';
import { UserIcon } from 'lucide-react';
import { PrivateComment } from './PrivateComment';
import { InputComment } from './InputComment';
import { useAuth } from '@/features/Auth/hooks';
import { commentFormProps } from '../types';
import { useCommentFormStore } from '../lib/stores/useCommentFormStore';

export const CommentForm = ({
  postId,
  onSuccess,
  commentId,
  initialData,
  mode = 'create',
  parentCommentId,
  defaultNickname,
  hideFields,
  defaultIsPrivate = false,
}: commentFormProps) => {
  const createComment = useCreateComment();
  const updateComment = useUpdateComment();
  const { isAdmin } = useAuth();

  // Zustand store 사용
  const { form, setForm, resetForm, initializeForm } = useCommentFormStore();

  // 컴포넌트 마운트 시 폼 초기화
  useEffect(() => {
    initializeForm(isAdmin, initialData, defaultNickname, defaultIsPrivate);
    // cleanup 함수
    return () => resetForm(isAdmin, defaultIsPrivate);
  }, [isAdmin, initialData, defaultNickname, defaultIsPrivate]);

  // 비공개 상태 변경 핸들러
  const handlePrivacyChange = (value: boolean) => {
    console.log('Changing privacy to:', value);
    setForm({ isPrivate: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (createComment.isPending || updateComment.isPending) return;

    // 폼 유효성 검사
    if (!isAdmin && (!form.author || !form.password || !form.content)) {
      alert('작성자, 비밀번호, 댓글 내용을 모두 입력해주세요.');
      return;
    }

    if (isAdmin && !form.content) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      const commentData = {
        postId,
        author: isAdmin ? '작성자' : form.author,
        password: isAdmin ? '1234' : form.password,
        content: form.content,
        isPrivate: form.isPrivate,
        isAuthor: false,
        parentCommentId: parentCommentId || undefined,
        replies: [],
      };

      console.log('Submitting comment with data:', commentData);

      if (mode === 'create') {
        await createComment.mutateAsync(commentData);
      } else {
        await updateComment.mutateAsync({
          id: commentId!,
          ...commentData,
        });
      }

      // 성공 후 폼 초기화
      resetForm(isAdmin, defaultIsPrivate);
      onSuccess();
    } catch (error) {
      console.error('댓글 작성/수정 실패:', error);
      alert('댓글 작성/수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-6">
        <div className="flex gap-6 items-center">
          {!hideFields && !isAdmin && (
            <>
              <FormSectionItem className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                <UserIcon className="w-5 h-5 text-gray-500" />
              </FormSectionItem>
              <FormSectionItem
                title="닉네임"
                className="flex items-center gap-4"
              >
                <Input
                  type="text"
                  placeholder="닉네임을 입력하세요"
                  value={form.author}
                  onChange={(e) => setForm({ author: e.target.value })}
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
                  onChange={(e) => setForm({ password: e.target.value })}
                  className="flex-1 p-2 border rounded"
                  required={!isAdmin}
                />
              </FormSectionItem>
            </>
          )}
          {/* 비공개 설정은 항상 표시 */}
          <FormSectionItem className="flex items-center gap-4">
            <PrivateComment
              isPrivate={form.isPrivate}
              onChange={handlePrivacyChange}
            />
          </FormSectionItem>
        </div>

        <InputComment
          value={form.content}
          onChange={(value: string) => setForm({ content: value })}
          postId={postId}
          commentId={commentId || ''}
          mode={mode}
        />
      </div>
    </form>
  );
};
