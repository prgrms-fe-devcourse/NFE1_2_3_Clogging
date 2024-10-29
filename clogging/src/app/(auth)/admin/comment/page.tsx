import { Comment } from '@/features/Comment/types';
import CommentList from '@/features/Comment/ui/admin/CommentList';
import { mockComments } from '@/mocks/data/comments';
// import { getComments, deleteComment } from '@/lib/api/comments';
import React from 'react';

// 최근 댓글 limit(개) 가져오기
export function getMockComments(page: number, limit: number): Comment[] {
  const startIndex = (page - 1) * limit;
  return mockComments.slice(startIndex, startIndex + limit);
}
async function CommentManagePage() {
  // 댓글 데이터를 가져옵니다.
  // const comments = await getComments();
  const initialComments = getMockComments(1, 10);

  return (
    <div>
      <CommentList initialComments={initialComments} />
    </div>
  );
}

export default CommentManagePage;
