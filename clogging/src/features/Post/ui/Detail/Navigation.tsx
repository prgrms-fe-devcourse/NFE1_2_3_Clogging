// 본문 네비게이션

'use client';

import { useAdjacentPosts } from '@/features/Post/hooks';
import Link from 'next/link';

export const Navigation = ({ currentPostId }: { currentPostId: string }) => {
  const { data, isLoading } = useAdjacentPosts(currentPostId);

  if (isLoading) return null;

  return (
    <div className="grid grid-cols-2 gap-4 mt-8">
      {data?.prev && (
        <Link href={`/posts/${data.prev.id}`}>
          <div className="p-4 border rounded hover:bg-gray-50">
            <div className="text-sm text-gray-500">이전 글</div>
            <div className="font-medium">{data.prev.title}</div>
          </div>
        </Link>
      )}
      {data?.next && (
        <Link href={`/posts/${data.next.id}`}>
          <div className="p-4 border rounded hover:bg-gray-50">
            <div className="text-sm text-gray-500">다음 글</div>
            <div className="font-medium">{data.next.title}</div>
          </div>
        </Link>
      )}
    </div>
  );
};
