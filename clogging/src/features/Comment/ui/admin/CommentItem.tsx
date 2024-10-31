import React from 'react';
import Image from 'next/image';
// import { formatDate } from '../../utils/dateUtils';
import { useTheme } from '@/shared/providers/theme';

interface Comment {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  author: string;
  repliesCount: number;
  // 기타 필요한 필드들...
}
interface CommentItemProps {
  comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = React.memo(({ comment }) => {
  const { isDarkMode } = useTheme();
  // const formattedDate = comment.createdAt
  //   ? formatDate(comment.createdAt)
  //   : 'No date';

  return (
    <li
      className={`flex items-center gap-3 rounded-lg shadow-md p-3 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <div className="p-1 rounded-full overflow-hidden">
        <Image
          src="/icons/user.png"
          alt={`${comment.author}`}
          width={24}
          height={24}
        />
      </div>
      <div className="flex-1">
        <div className="overflow-hidden text-ellipsis mb-2">
          {comment.content}
        </div>
        <div className="flex items-center text-xs text-gray-400">
          <div className="font-bold mr-2">{comment.author}</div>
          <div>{comment.createdAt}</div>
        </div>
      </div>
      <button className="group mr-2 rounded-full transition-all duration-200 ease-in-out">
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
});

CommentItem.displayName = 'CommentItem';

export default CommentItem;
