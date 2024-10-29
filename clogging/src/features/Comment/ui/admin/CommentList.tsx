'use client';
import { useTheme } from '@/shared/providers/theme';
import Image from 'next/image';
import React, { useState } from 'react';
import { formatDate } from '../../utils/dateUtils';
import { Comment } from '../../types';
interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({
  comments: initialComments,
}) => {
  const [comments, setComments] = useState(initialComments);
  const { isDarkMode } = useTheme();

  const handleDelete = async (id: string) => {
    try {
      // await deleteComment(id);
      // 추후 수정.
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== id),
      );
      console.log(`댓글 ${id} 삭제됨`);
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error);
    }
  };

  return (
    <div
      className={`flex-1 rounded-lg shadow-md p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
    >
      <ul className="space-y-4">
        {comments.map((comment) => (
          <li
            key={comment.id}
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
            <div className="flex-1 ">
              <div className="overflow-hidden text-ellipsis mb-2">
                {comment.content}
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <div className="font-bold mr-2">{comment.nickname}</div>
                <div>{formatDate(comment.createdAt)}</div>
              </div>
            </div>
            <button onClick={() => handleDelete(comment.id)}>
              <Image
                src={isDarkMode ? '/icons/trash_wh.png' : '/icons/trash.png'}
                alt={'삭제'}
                width={26}
                height={26}
                className="p-1 object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
