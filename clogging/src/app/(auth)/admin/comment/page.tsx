import CommentList from '@/features/Comment/ui/admin/CommentList';
import { getAllComments } from '@/shared/api/services/comment/getAllComments';
import React from 'react';

async function CommentManagePage() {
  // 서버 사이드에서 댓글 데이터를 가져옵니다.
  const { comments, totalComments } = await getAllComments();

  return (
    <div>
      <p>총 댓글 수: {totalComments}</p>
      <CommentList commentsData={comments} />
    </div>
  );
}

export default CommentManagePage;
