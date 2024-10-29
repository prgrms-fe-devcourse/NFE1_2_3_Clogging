// 본문 네비게이션

'use client';

import { useAdjacentPosts } from '@/features/Post/hooks';
import Link from 'next/link';

export const Navigation = ({ currentPostId }: { currentPostId: string }) => {
  const { data, isLoading } = useAdjacentPosts(currentPostId);

  if (isLoading) return null;

  return (
    <div className="grid grid-cols-2 gap-4 mt-8">
      <Link
        href={data?.prev ? `/posts/${data.prev.id}` : '#'}
        className={!data?.prev ? 'cursor-not-allowed' : ''}
      >
        <div
          className={`p-4 border rounded ${
            data?.prev ? 'hover:bg-gray-50' : 'bg-gray-100'
          }`}
        >
          <div className="text-sm text-gray-500 mb-4">이전 글</div>
          <div className="font-medium">
            {data?.prev ? data.prev.title : '이전 글이 없습니다.'}
          </div>
        </div>
      </Link>
      <Link
        href={data?.next ? `/posts/${data.next.id}` : '#'}
        className={!data?.next ? 'cursor-not-allowed' : ''}
      >
        <div
          className={`p-4 border rounded ${
            data?.next ? 'hover:bg-gray-50' : 'bg-gray-100'
          }`}
        >
          <div className="text-sm text-gray-500 mb-4">다음 글</div>
          <div className="font-medium">
            {data?.next ? data.next.title : '다음 글이 없습니다.'}
          </div>
        </div>
      </Link>
    </div>
  );
};
