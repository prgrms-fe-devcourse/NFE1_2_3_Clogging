// 제목, 작성일 등

import { Post } from '@/features/types';

export const PostDetailContent = ({ post }: { post: Post }) => {
  return <div className="mt-8">{post.content}</div>;
};
