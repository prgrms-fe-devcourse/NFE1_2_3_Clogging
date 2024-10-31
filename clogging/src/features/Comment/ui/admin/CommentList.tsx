'use client';
import { useTheme } from '@/shared/providers/theme';
import React, { useState } from 'react';
import CommentItem from './CommentItem';
import EmptyComment from './EmptyComment';

interface Comment {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  author: string;
  repliesCount: number;
  // 기타 필요한 필드들...
}
interface CommentListProps {
  commentsData: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ commentsData }) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`flex-1 rounded-lg shadow-sm p-4 sm:p-6 mt-8 mb-2 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      {commentsData.length > 0 ? (
        <>
          <ul className="space-y-4">
            {commentsData.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </ul>
          {/* {hasMore && (
            <div className="flex justify-center mt-6">
              <Button onClick={handleLoadMore} variant="secondary">
                더보기
              </Button>
            </div>
          )} */}
        </>
      ) : (
        <EmptyComment />
      )}
    </div>
  );
};

export default CommentList;
