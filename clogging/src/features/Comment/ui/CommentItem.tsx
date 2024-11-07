'use client';

import { Button } from '@/shared/ui/common/Button';
import { Textarea } from '@/shared/ui/Form/Form';
import { CommentForm } from './CommentForm';
import { useAuth } from '@/features/Auth/hooks';
import { CardContent, CardHeader, CardTitle } from '@/shared/ui/common/Card';
import { commentItemProps, CommentWithReplies } from '../types';
import { PrivateComment } from './PrivateComment';
import { elapsedTime } from '@/shared/lib/utils/elapsedTimeCalculation';
import { useTheme } from '@/shared/providers/theme';

export const CommentItem = ({
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
  const { isDarkMode } = useTheme();
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className="comment-thread w-full">
      {/* 댓글 카드 */}
      <div
        className={`relative ${
          level > 0
            ? 'ml-1 sm:ml-2 md:ml-4 pl-1 sm:pl-2 md:pl-4 border-l border-gray-200 dark:border-gray-700'
            : ''
        }`}
      >
        <CardContent
          className={`p-2 sm:p-3 md:p-4 rounded-lg ${
            level > 0
              ? isDarkMode
                ? 'bg-gray-800'
                : 'bg-gray-50'
              : isDarkMode
                ? 'bg-gray-900'
                : 'bg-white'
          } border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-200`}
        >
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-3 md:mb-4 gap-2 sm:gap-2">
            <CardTitle className="flex items-center gap-2 sm:gap-2 mb-2 sm:mb-0">
              <span
                className={`font-bold text-sm sm:text-base ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
              >
                {comment.author}
              </span>
              {comment.author === '관리자' && (
                <span
                  className={`px-1 sm:px-2 py-0.5 ${isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'} text-xs sm:text-sm rounded`}
                >
                  작성자
                </span>
              )}
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2 w-full sm:w-auto">
              <time
                className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2 sm:mb-0`}
              >
                {elapsedTime(new Date(comment.createdAt).toISOString())}
              </time>
              <div className="flex gap-2 sm:gap-2 w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(comment.id)}
                  className="text-xs sm:text-sm px-2 sm:px-3 flex-1 sm:flex-none"
                >
                  수정
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(comment.id)}
                  className="text-xs sm:text-sm px-2 sm:px-3 flex-1 sm:flex-none"
                >
                  삭제
                </Button>
                {level === 0 && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onReply(comment.id)}
                    className="text-xs sm:text-sm px-2 sm:px-3 flex-1 sm:flex-none"
                  >
                    답글
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          {/* 댓글 내용 */}
          {isEditing ? (
            <div className="space-y-3 sm:space-y-2">
              <Textarea
                value={editingContent}
                onChange={(e) => onEditContentChange(e.target.value)}
                className={`w-full text-sm sm:text-base ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}
              />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-2">
                <PrivateComment
                  isPrivate={editingIsPrivate}
                  onChange={onEditPrivateChange}
                />
                <div className="flex justify-end gap-2 w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEditSubmit(comment.id)}
                    className="text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    수정 완료
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onEditCancel}
                    className="text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    취소
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p
              className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} break-words text-sm sm:text-base`}
            >
              {comment.isPrivate && !isAdmin && !isEditing
                ? '비공개 댓글입니다.'
                : comment.content}
            </p>
          )}
        </CardContent>

        {/* 답글 작성 폼 */}
        {isReplying && (
          <CardContent
            className={`p-2 sm:p-3 md:p-4 rounded-lg mt-3 sm:mt-3 md:mt-4 ml-1 sm:ml-2 md:ml-4 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <CommentForm
              postId={postId}
              onSuccess={() =>
                onReplySuccess({ content: '', author: '', password: '' })
              }
              mode="create"
              parentCommentId={comment.id}
              defaultNickname={isAdmin ? '관리자' : ''}
              hideFields={isAdmin}
              defaultIsPrivate={comment.isPrivate}
            />
            <div className="flex justify-end mt-3 sm:mt-3 md:mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onReplyCancel}
                className="text-xs sm:text-sm w-full sm:w-auto"
              >
                취소
              </Button>
            </div>
          </CardContent>
        )}

        {/* 답글 목록 */}
        {hasReplies && (
          <CardContent className="mt-3 sm:mt-2 space-y-3 sm:space-y-2">
            {comment.replies
              ?.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((reply: CommentWithReplies) => (
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
          </CardContent>
        )}
      </div>
    </div>
  );
};
