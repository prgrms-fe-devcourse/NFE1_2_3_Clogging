import CommentList from '@/features/Comment/ui/admin/CommentList';
// import { getComments, deleteComment } from '@/lib/api/comments';
import React from 'react';

async function CommentManagePage() {
  // 댓글 데이터를 가져옵니다.
  // const comments = await getComments();

  return (
    <div>
      <CommentList />
    </div>
  );
}

export default CommentManagePage;
