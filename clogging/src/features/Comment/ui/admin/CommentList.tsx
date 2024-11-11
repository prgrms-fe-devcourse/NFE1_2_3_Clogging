'use client';
import { useTheme } from '@/shared/providers/theme';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CommentItem from './CommentItem';
import EmptyComment from './EmptyComment';
import { AdminComment } from '@/app/(auth)/admin/comment/page';
import { Button } from '@/shared/ui/common/Button';
import Pagination from '@/features/Admin/Dashboard/ui/Pagination';

interface CommentListProps {
  initialComments: AdminComment[]; // 초기 댓글 데이터
  totalComments: number; // 총 댓글 수
  onDelete: (commentId: string) => void; // 삭제 핸들러 추가
  PAGE_SIZE: number;
}

const CommentList: React.FC<CommentListProps> = ({
  initialComments,
  totalComments,
  onDelete,
  PAGE_SIZE,
}) => {
  const { isDarkMode } = useTheme();

  const [comments, setComments] = useState(initialComments);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const totalPages = Math.ceil(Number(comments.length) / PAGE_SIZE);

  const displayedComments = useMemo(
    () =>
      initialComments.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
      ),
    [initialComments, currentPage, PAGE_SIZE],
  );

  const handleDelete = useCallback(
    (commentId: string) => {
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId),
      );
      onDelete(commentId);
    },
    [onDelete],
  );

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);
  useEffect(() => {
    if (displayedComments.length === 0 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [displayedComments.length, currentPage]);

  if (comments.length === 0) {
    return <EmptyComment />;
  }
  return (
    <div
      className={`flex-1 rounded-md shadow-sm p-4 mb-2 text-xs ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      {displayedComments.length > 0 ? (
        <>
          <h2 className="text-lg font-semibold mb-6">최신 댓글</h2>
          <ul className="space-y-4 mb-8">
            {displayedComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onDelete={handleDelete}
              />
            ))}
          </ul>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <EmptyComment />
      )}
    </div>
  );
};

export default CommentList;
