// 제목, 작성일 등

import { Post } from '@/features/Post/types';

export const Content = ({ post }: { post: Post }) => {
  return <div className="mt-8">{post.content}</div>;
};
