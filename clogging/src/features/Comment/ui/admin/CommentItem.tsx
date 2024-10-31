// src/features/Comment/ui/admin/CommentItem.tsx
import React from 'react';
import Image from 'next/image';
import { useTheme } from '@/shared/providers/theme';
import { adminDeleteComment } from '../../utils/adminDeleteComment';
import ReplyList from './ReplyItem';

interface Comment {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  author: string;
  repliesCount: number;
  replies: Reply[];
}

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: string, postId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = React.memo(
  ({ comment, onDelete }) => {
    const { isDarkMode } = useTheme();

    const handleDelete = async () => {
      const confirmed = confirm('댓글을 삭제하시겠습니까?');
      if (confirmed) {
        const success = await adminDeleteComment(comment.id, comment.postId);
        if (success) {
          alert('댓글이 삭제되었습니다.');
          onDelete(comment.id, comment.postId);
        } else {
          alert('댓글 삭제에 실패했습니다.');
        }
      }
    };

    return (
      <li
        className={`flex flex-col gap-3 rounded-lg shadow-md p-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="flex items-center">
          <div className="p-1 rounded-full overflow-hidden">
            <Image
              src="/icons/user.png"
              alt={`${comment.author}`}
              width={24}
              height={24}
            />
          </div>
          <div className="flex-1 ml-3">
            <div className="overflow-hidden text-ellipsis mb-2">
              {comment.content}
            </div>
            <div className="flex items-center text-xs text-gray-400">
              <div className="font-bold mr-2">{comment.author}</div>
              <div>{comment.createdAt}</div>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="group mr-2 rounded-full transition-all duration-200 ease-in-out"
          >
            <div className="w-6 h-6 p-1 transform transition-transform duration-200 ease-in-out group-hover:scale-110">
              <Image
                src={isDarkMode ? '/icons/trash_wh.png' : '/icons/trash.png'}
                alt={'삭제'}
                width={26}
                height={26}
                className="object-cover"
              />
            </div>
          </button>
        </div>

        {/* 답글 렌더링 */}
        {comment.replies.length > 0 && (
          <ReplyList
            replies={comment.replies}
            commentId={comment.id}
            postId={comment.postId}
          />
        )}
      </li>
    );
  },
);

CommentItem.displayName = 'CommentItem';

export default CommentItem;
