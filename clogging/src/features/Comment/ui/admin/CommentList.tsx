'use client';
import { useTheme } from '@/shared/providers/theme';
import React, { useState } from 'react';
import { Comment } from '../../types';
import CommentItem from './CommentItem';
import EmptyComment from './EmptyCommet';
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
      className={`flex-1 rounded-lg shadow-sm p-4 sm:p-6 mt-8 mb-2 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      {comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      ) : (
        <EmptyComment />
      )}
    </div>
  );
};

export default CommentList;
