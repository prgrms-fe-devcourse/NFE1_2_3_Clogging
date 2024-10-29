'use client';
import { useTheme } from '@/shared/providers/theme';
import React, { useState } from 'react';
import CommentItem from './CommentItem';
import EmptyComment from './EmptyComment';
import { getRecentMockComments } from '../../utils/recentComment';
import { Button } from '@/shared/ui/common/Button';

// interface CommentListProps {
//   initialComments: Comment[];
// }

const CommentList = () => {
  const initialComments = getRecentMockComments(1, 7);
  const [comments, setComments] = useState(initialComments);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { isDarkMode } = useTheme();

  const handleLoadMore = () => {
    const nextPage = page + 1;
    const newComments = getRecentMockComments(nextPage, 7);
    if (newComments.length > 0) {
      setComments((prev) => [...prev, ...newComments]);
      setPage(nextPage);
    } else {
      setHasMore(false);
    }
  };

  const handleDelete = async (id: string) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== id),
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
          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button onClick={handleLoadMore} variant="secondary">
                더보기
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyComment />
      )}
    </div>
  );
};

export default CommentList;
