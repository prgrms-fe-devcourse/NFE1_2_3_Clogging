'use client';

import React, { useEffect } from 'react';
import { useCreateComment, useUpdateComment } from '../api/useComments';
import { useCreateReply } from '../api/Reply/useReply';
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
  const createReply = useCreateReply();
  const { isAdmin } = useAuth();
  const { form, setForm, resetForm, initializeForm } = useCommentFormStore();

  useEffect(() => {
    initializeForm(isAdmin, initialData, defaultNickname, defaultIsPrivate);
    return () => resetForm(isAdmin, defaultIsPrivate);
  }, [isAdmin, initialData, defaultNickname, defaultIsPrivate]);

  const handlePrivacyChange = async (value: boolean) => {
    setForm({ isPrivate: value });

    if (mode === 'edit' && commentId) {
      try {
        const response = await updateComment.mutateAsync({
          postId,
          commentId,
          content: form.content,
          password: isAdmin ? '1234' : form.password,
          isPrivate: value,
          author: isAdmin ? '관리자' : form.author,
        });

        if (!response) {
          throw new Error('응답 데이터가 없습니다.');
        }

        onSuccess?.();
      } catch (error) {
        let errorMessage = '비공개 설정 변경에 실패했습니다.';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        alert(errorMessage);
        setForm({ isPrivate: !value });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      createComment.isPending ||
      updateComment.isPending ||
      createReply.isPending
    )
      return;

    if (!isAdmin && (!form.author || !form.password || !form.content)) {
      alert('작성자, 비밀번호, 댓글 내용을 모두 입력해주세요.');
      return;
    }

    if (isAdmin && !form.content) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      const commonData = {
        postId,
        author: isAdmin ? '관리자' : form.author,
        password: isAdmin ? '1234' : form.password,
        content: form.content,
        isPrivate: form.isPrivate,
      };

      if (mode === 'create') {
        if (parentCommentId) {
          await createReply.mutateAsync({
            ...commonData,
            commentId: parentCommentId,
            replyId: '',
          });
        } else {
          await createComment.mutateAsync(commonData);
        }
      } else {
        await updateComment.mutateAsync({
          commentId: commentId!,
          ...commonData,
        });
      }

      resetForm(isAdmin, defaultIsPrivate);
      onSuccess();
    } catch (error) {
      alert('작성/수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
          {!hideFields && !isAdmin && (
            <>
              <FormSectionItem className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                <UserIcon className="w-5 h-5 text-gray-500" />
              </FormSectionItem>
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto">
                <FormSectionItem
                  title="닉네임"
                  className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full md:w-auto"
                >
                  <Input
                    type="text"
                    placeholder="닉네임을 입력하세요"
                    value={form.author}
                    onChange={(e) => setForm({ author: e.target.value })}
                    className="w-full md:w-[200px] p-2 border rounded"
                    required={!isAdmin}
                  />
                </FormSectionItem>
                <FormSectionItem
                  title="비밀번호"
                  className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full md:w-auto"
                >
                  <Input
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={form.password}
                    onChange={(e) => setForm({ password: e.target.value })}
                    className="w-full md:w-[200px] p-2 border rounded"
                    required={!isAdmin}
                  />
                </FormSectionItem>
              </div>
            </>
          )}
          <FormSectionItem className="flex items-center gap-4 justify-between w-full">
            {isAdmin && (
              <span className="text-xl font-bold text-blue-800">관리자</span>
            )}
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
