// 제목, 작성일 등

import { Post } from '@/features/Post/types';
import Image from 'next/image';

export const Content = ({ post }: { post: Post }) => {
  return (
    <div className="mt-8">
      {post.img && (
        <Image
          src={post.img}
          alt={post.title}
          width={1200}
          height={400}
          className="w-full h-[400px] object-cover rounded-lg mb-8"
        />
      )}
      {post.content}
    </div>
  );
};
