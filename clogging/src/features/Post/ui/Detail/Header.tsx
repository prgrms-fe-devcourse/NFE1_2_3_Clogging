// 본문 내용

import { Post } from '@/features/Post/types';
import { Badge } from '@/shared/ui/common/Badge';
import { elapsedTime } from '../../../../shared/lib/utils/elapsedTimeCalculation';
import { useCategories } from '@/features/Category/hooks';

export const Header = ({ post }: { post: Post }) => {
  const { getCategoryName } = useCategories();

  console.log('포스트입니다. ', post);

  return (
    <header className="mb-8">
      <h1 className="text-4xl font-bold mt-4">{post.title}</h1>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <Badge>{getCategoryName(post.categoryId)}</Badge>
        <span>|</span>
        <span>조회수: {post.viewCount}</span>
        <span>|</span>
        <time>{elapsedTime(new Date(post.createdAt).toISOString())}</time>
      </div>
      <div className="flex gap-2 mt-4">
        {post.tags?.map((tag) => (
          <span key={tag} className="px-2 py-1 text-sm bg-gray-100 rounded">
            {tag}
          </span>
        ))}
      </div>
    </header>
  );
};
