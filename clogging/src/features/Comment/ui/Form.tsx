'use client';

import React, { useState, useEffect } from 'react';
import { useCreateComment, useUpdateComment } from '../hooks';
import { Input } from '@/shared/ui/common/Input';
import { FormSectionItem } from '@/shared/ui/Form/Form';
import { UserIcon } from 'lucide-react';
import { PrivateComment } from './PrivateComment';
import { InputComment } from './InputComment';
import { useAuth } from '@/features/Auth/hooks';

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
  defaultNickname?: string;
  hideFields?: boolean;
  defaultIsPrivate?: boolean;
}

export const Form = ({
  postId,
  onSuccess,
  commentId,
  initialData,
  mode = 'create',
  parentCommentId,
  defaultNickname,
  hideFields,
  defaultIsPrivate = false,
}: FormProps) => {
  const createComment = useCreateComment();
  const updateComment = useUpdateComment();
  const { isAdmin } = useAuth();

  // 초기 상태 설정
  const [form, setForm] = useState({
    nickname: isAdmin
      ? '작성자'
      : initialData?.nickname || defaultNickname || '',
    password: isAdmin ? 'admin' : '',
    content: initialData?.content || '',
    isPrivate: initialData?.isPrivate ?? defaultIsPrivate,
  });

  // 비공개 상태가 변경될 때마다 로그 출력
  useEffect(() => {
    console.log('Privacy state changed:', form.isPrivate);
  }, [form.isPrivate]);

  const handlePrivacyChange = (value: boolean) => {
    console.log('Changing privacy to:', value);
    setForm((prev) => ({ ...prev, isPrivate: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (createComment.isPending || updateComment.isPending) return;

    // 폼 유효성 검사
    if (!isAdmin && (!form.nickname || !form.password || !form.content)) {
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
        nickname: isAdmin ? '작성자' : form.nickname,
        password: isAdmin ? 'admin' : form.password,
        content: form.content,
        isPrivate: form.isPrivate,
        isAuthor: false,
        parentCommentId: parentCommentId || undefined,
        replies: [],
      };

      console.log('Submitting comment with data:', commentData);

      if (mode === 'create') {
        const response = await createComment.mutateAsync(commentData);
        console.log('댓글 생성 성공:', response);
      } else {
        const response = await updateComment.mutateAsync({
          id: commentId!,
          ...commentData,
        });
        console.log('댓글 수정 성공:', response);
      }

      // 성공 후 폼 초기화
      setForm({
        nickname: isAdmin ? '작성자' : '',
        password: isAdmin ? 'admin' : '',
        content: '',
        isPrivate: defaultIsPrivate,
      });

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
          onChange={(value) => setForm((prev) => ({ ...prev, content: value }))}
          postId={postId}
          commentId={commentId || ''}
          mode={mode}
        />
      </div>
    </form>
  );
};
