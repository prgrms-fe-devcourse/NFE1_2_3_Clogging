'use client';

import { Button } from '@/shared/ui/common/Button';
import { Textarea } from '@/shared/ui/Form/Form';
import { CommentForm } from './CommentForm';
import { useAuth } from '@/features/Auth/hooks';
import { elapsedTime } from '@/shared/lib/utils/elapsedTimeCalculation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/common/Card';
import { commentItemProps, CommentWithReplies } from '../types';

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
        <CardContent
          className={`p-4 rounded-lg ${level > 0 ? 'bg-gray-50' : 'bg-white'} border`}
        >
          {/* 댓글 헤더 */}
          <CardHeader className="flex justify-between items-center mb-4">
            <CardTitle className="flex items-center gap-2">
              <span className="font-bold">{comment.nickname}</span>
              {comment.isAuthor && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-sm rounded">
                  작성자
                </span>
              )}
            </CardTitle>
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
          </CardHeader>

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
        </CardContent>

        {/* 답글 작성 폼 */}
        {isReplying && (
          <Card className="mt-4 ml-4 border">
            <CommentForm
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
                (
                  a: { createdAt: string | number | Date },
                  b: { createdAt: string | number | Date },
                ) =>
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
          </div>
        )}
      </div>
    </div>
  );
};
