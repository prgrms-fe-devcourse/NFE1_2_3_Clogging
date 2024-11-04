import React from 'react';
import Image from 'next/image';
import { Reply } from './CommentItem';
import { useTheme } from '@/shared/providers/theme';

interface ReplyListProps {
  replies: Reply[];
  onDeleteReply: (replyId: string) => void; // 답글 삭제 핸들러
}

const ReplyList: React.FC<ReplyListProps> = ({ replies, onDeleteReply }) => {
  const { isDarkMode } = useTheme(); // 테마에 따라 다크 모드 여부 확인

  return (
    <ul className="mt-4 space-y-2">
      {replies.map((reply) => (
        <li
          key={reply.id}
          className={`flex items-center justify-between p-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded`}
        >
          <div className="flex flex-col">
            <span className="font-bold">{reply.author}</span>
            <span>{reply.content}</span>
            <span className="text-xs text-gray-400">{reply.createdAt}</span>
          </div>
          <button
            onClick={() => onDeleteReply(reply.id)}
            className="group rounded-full transition-all duration-200 ease-in-out"
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
      ))}
    </ul>
  );
};

export default ReplyList;
