'use client';
import { useTheme } from '@/shared/providers/theme';
import React, { useMemo, useState } from 'react';
import CommentItem from './CommentItem';
import EmptyComment from './EmptyComment';
import { AdminComment } from '@/app/(auth)/admin/comment/page';
import { Button } from '@/shared/ui/common/Button';

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

  // 초기 댓글 데이터를 상태로 설정합니다.
  const [comments, setComments] = useState<AdminComment[]>(initialComments);
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태

  // 메모이제이션을 사용하여 초기 댓글을 저장합니다.
  const memoizedComments = useMemo(
    () =>
      comments.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE),
    [comments, currentPage, PAGE_SIZE],
  );

  const handleDelete = (commentId: string) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId),
    );
    onDelete(commentId); // 부모 컴포넌트에 삭제 알림
  };

  const totalPages = Math.ceil(totalComments / PAGE_SIZE); // 총 페이지 수 계산

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div
      className={`flex-1 rounded-md shadow-sm p-4 mb-2 text-xs ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      {memoizedComments.length > 0 ? (
        <>
          <h2 className="text-lg font-semibold mb-6">최신 댓글</h2>
          <ul className="space-y-4 mb-8">
            {memoizedComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onDelete={handleDelete}
              />
            ))}
          </ul>
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className={`rounded-lg ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              이전
            </Button>
            <span>
              {currentPage + 1} / {totalPages} {/* 현재 페이지 표시 */}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
              className={`rounded-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              다음
            </Button>
          </div>
        </>
      ) : (
        <EmptyComment />
      )}
    </div>
  );
};

export default CommentList;
