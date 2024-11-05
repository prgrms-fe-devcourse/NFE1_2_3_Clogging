'use client';
import CommentList from '@/features/Comment/ui/admin/CommentList';
import { getAllComments } from '@/features/Comment/api/getAllComments';
import React, { useEffect, useState } from 'react';
import { Reply } from '@/features/Comment/ui/admin/CommentItem';

// Comment 인터페이스 정의
export interface AdminComment {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  author?: string;
  isPrivate?: boolean;
  replies?: Reply[];
}

// CommentManagePage 컴포넌트 정의
const CommentManagePage: React.FC = () => {
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState<string | null>(null); // 오류 상태 관리
  const [commentsData, setCommentsData] = useState<{
    comments: AdminComment[]; // 댓글 데이터 배열
    totalComments: number; // 총 댓글 수
  } | null>(null); // 초기값은 null

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getAllComments(); // 댓글 데이터 로드
        setCommentsData(data); // 댓글 데이터 상태 업데이트
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error'); // 오류 메시지 처리
      } finally {
        setLoading(false); // 로딩 완료 상태로 변경
      }
    };

    fetchComments(); // 댓글 데이터 가져오기 호출
  }, []);

  // 댓글 삭제 핸들러 정의
  const handleDeleteComment = (commentId: string) => {
    if (commentsData) {
      setCommentsData((prevData) => ({
        comments: prevData.comments.filter(
          (comment) => comment.id !== commentId, // 삭제할 댓글 제외
        ),
        totalComments: prevData.totalComments - 1, // 총 댓글 수 감소
      }));
    }
  };

  if (loading) {
    return <div>Loading comments...</div>; // 로딩 중 메시지 표시
  }

  if (error) {
    return <div>Error loading comments: {error}</div>; // 오류 발생 시 메시지 표시
  }

  return (
    <div>
      <CommentList
        initialComments={commentsData?.comments || []} // 초기 댓글 데이터 전달
        totalComments={commentsData?.totalComments || 0} // 총 댓글 수 전달
        onDelete={handleDeleteComment} // 삭제 핸들러 전달
        PAGE_SIZE={7}
      />
    </div>
  );
};

export default CommentManagePage;
