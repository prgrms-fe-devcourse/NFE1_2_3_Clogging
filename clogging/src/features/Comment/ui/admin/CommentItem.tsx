import React from 'react';
import Image from 'next/image';
import { formatDate } from '../../utils/dateUtils';
import { Comment } from '../../types';
import { useTheme } from '@/shared/providers/theme';

interface CommentItemProps {
  comment: Comment;
  onDelete: (id: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = React.memo(
  ({ comment, onDelete }) => {
    const { isDarkMode } = useTheme();

    return (
      <li
        className={`flex items-center gap-3 rounded-lg shadow-md p-3 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="p-1 rounded-full overflow-hidden">
          <Image
            src="/icons/user.png"
            alt={`${comment.nickname}`}
            width={24}
            height={24}
          />
        </div>
        <div className="flex-1">
          <div className="overflow-hidden text-ellipsis mb-2">
            {comment.content}
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <div className="font-bold mr-2">{comment.nickname}</div>
            <div>{formatDate(comment.createdAt)}</div>
          </div>
        </div>
        <button
          onClick={() => onDelete(comment.id)}
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
      </li>
    );
  },
);

CommentItem.displayName = 'CommentItem';

export default CommentItem;
