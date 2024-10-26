import React, { useState } from 'react';
import { useCreateComment } from './model/comment';

export const CommentForm = ({ postId }: { postId: string }) => {
  const [form, setForm] = useState({
    nickname: '',
    password: '',
    content: '',
    isPrivate: false,
  });

  const createComment = useCreateComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createComment.mutate({
      postId,
      ...form,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="닉네임"
          value={form.nickname}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, nickname: e.target.value }))
          }
          className="flex-1 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, password: e.target.value }))
          }
          className="flex-1 p-2 border rounded"
        />
      </div>
      <textarea
        placeholder="댓글을 입력하세요"
        value={form.content}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, content: e.target.value }))
        }
        className="w-full p-2 border rounded"
        rows={3}
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isPrivate}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, isPrivate: e.target.checked }))
            }
          />
          비공개
        </label>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={createComment.isPending}
        >
          댓글 작성
        </button>
      </div>
    </form>
  );
};
