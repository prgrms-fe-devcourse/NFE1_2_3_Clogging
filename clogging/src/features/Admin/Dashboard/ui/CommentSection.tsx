// CommentSection.tsx
import React from 'react';
import CommentList from '@/features/Comment/ui/admin/CommentList';
import { AdminComment } from '@/app/(auth)/admin/comment/page';

interface CommentSectionProps {
  comments: AdminComment[];
  totalComments: number;
  onDelete: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  totalComments,
  onDelete,
}) => {
  return (
    <CommentList
      initialComments={comments}
      totalComments={totalComments}
      onDelete={onDelete}
      PAGE_SIZE={3}
    />
  );
};

export default CommentSection;
