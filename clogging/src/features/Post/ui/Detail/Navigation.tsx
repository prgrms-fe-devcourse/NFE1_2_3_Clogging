// 본문 네비게이션

'use client';

import { useAdjacentPosts } from '@/features/Post/hooks';
import Link from 'next/link';

export const Navigation = ({ currentPostId }: { currentPostId: string }) => {
  const { data, isLoading } = useAdjacentPosts(currentPostId);

  console.log('네비게이션 이동 data', data);

  if (isLoading) return null;

  return (
    <div className="grid grid-cols-2 gap-4 mt-8">
      <Link
        href={data?.prevPost ? `/posts/${data.prevPost.id}` : '#'}
        className={!data?.prevPost ? 'cursor-not-allowed' : ''}
      >
        <div
          className={`p-4 border dark:border-gray-700 rounded ${
            data?.prevPost
              ? 'hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white'
              : 'bg-gray-100 dark:bg-gray-800'
          }`}
        >
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            이전 글
          </div>
          <div className="font-medium">
            {data?.prevPost ? data.prevPost.title : '이전 글이 없습니다.'}
          </div>
        </div>
      </Link>
      <Link
        href={data?.nextPost ? `/posts/${data.nextPost.id}` : '#'}
        className={!data?.nextPost ? 'cursor-not-allowed' : ''}
      >
        <div
          className={`p-4 border dark:border-gray-700 rounded ${
            data?.nextPost
              ? 'hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white'
              : 'bg-gray-100 dark:bg-gray-800'
          }`}
        >
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            다음 글
          </div>
          <div className="font-medium">
            {data?.nextPost ? data.nextPost.title : '다음 글이 없습니다.'}
          </div>
        </div>
      </Link>
    </div>
  );
};
