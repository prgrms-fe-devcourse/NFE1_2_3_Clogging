import { Button } from '@/shared/ui/common/Button';
import { Textarea } from '@/shared/ui/Form/Form';
import { useAuth } from '@/features/Auth/hooks';
import {
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
} from '../lib/hooks/useComments';
import { InputCommentProps } from './types';

export const InputComment = ({
  value,
  onChange,
  postId,
  commentId,
  onSuccess,
  mode,
}: InputCommentProps) => {
  const createComment = useCreateComment();
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();
  const { isAdmin } = useAuth();

  // Remove duplicate form state from InputComment
  const handleDelete = async () => {
    if (!commentId || (!isAdmin && !value)) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        await deleteComment.mutateAsync({
          postId,
          commentId,
          password: '',
        });
        onSuccess?.();
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
        alert('댓글 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 h-[90px]">
      <Textarea
        placeholder="댓글을 입력하세요"
        value={value} // Use the value prop directly
        onChange={(e) => onChange(e.target.value)} // Call the onChange prop directly
        className="flex-1 p-2 border rounded"
        rows={3}
        required
      />
      <div className="flex flex-col gap-2 h-full">
        <Button
          type="submit"
          className="h-full px-6 whitespace-nowrap bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
            className="h-full px-6 whitespace-nowrap bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={deleteComment.isPending}
          >
            {deleteComment.isPending ? '삭제 중...' : '댓글 삭제'}
          </Button>
        )}
      </div>
    </div>
  );
};
