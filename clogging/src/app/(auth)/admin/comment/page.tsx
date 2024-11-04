'use client';
import CommentList from '@/features/Comment/ui/admin/CommentList';
import { getAllComments } from '@/features/Comment/api/getAllComments';
import React, { useEffect, useState } from 'react';

// Comment 인터페이스 정의
export interface AdminComment {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  author?: string;
  isPrivate?: boolean;
  replies?: Comment[];
}

const CommentManagePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentsData, setCommentsData] = useState<{
    comments: Comment[]; // Comment 타입으로 변경
    totalComments: number;
  } | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getAllComments(); // 댓글 데이터 로드
        setCommentsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error'); // 오류 메시지 처리
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (loading) {
    return <div>Loading comments...</div>; // 로딩 중 메시지
  }

  if (error) {
    return <div>Error loading comments: {error}</div>; // 오류 메시지
  }

  return (
    <div>
      <p>총 댓글 수: {commentsData?.totalComments}</p>
      <CommentList
        initialComments={commentsData?.comments || []}
        totalComments={commentsData?.totalComments || 0}
      />
    </div>
  );
};

export default CommentManagePage;
