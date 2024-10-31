'use client';
import { useTheme } from '@/shared/providers/theme';
import React, { useState } from 'react';
import CommentItem from './CommentItem';
import EmptyComment from './EmptyComment';
interface reply {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  author: string;
}
interface Comment {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  author: string;
  replies: reply[];
  repliesCount: number;
}
interface CommentListProps {
  commentsData: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ commentsData }) => {
  const { isDarkMode } = useTheme();
  const [comments, setComments] = useState<Comment[]>(commentsData);

  const handleDelete = (commentId: string) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId),
    );
  };

  return (
    <div
      className={`flex-1 rounded-lg shadow-sm p-4 sm:p-6 mt-8 mb-2 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      {comments.length > 0 ? (
        <>
          <ul className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </>
      ) : (
        <EmptyComment />
      )}
    </div>
  );
};

export default CommentList;
