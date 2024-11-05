import { Post } from '@/features/Post/types';
import { Badge } from '@/shared/ui/common/Badge';
import { elapsedTime } from '../../../../shared/lib/utils/elapsedTimeCalculation';
import { useCategories } from '@/features/Category/hooks';
import { useEffect, useState } from 'react';

export const Header = ({ post }: { post: Post }) => {
  const { categories, fetchCategories } = useCategories();
  const [categoryName, setCategoryName] = useState<string>('카테고리');

  useEffect(() => {
    // 컴포넌트 마운트 시 카테고리 데이터 불러오기
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    // post.category 또는 post.categoryId가 있고, categories가 로드되었을 때
    if ((post.category || post.categoryId) && categories.length > 0) {
      const categoryId = post.category || post.categoryId;
      const foundCategory = categories.find((cat) => cat.id === categoryId);
      setCategoryName(foundCategory?.name || '카테고리');
    }
  }, [post.category, post.categoryId, categories]);

  console.log('포스트입니다. ', post);

  return (
    <header className="mb-8">
      <h1 className="text-4xl font-bold mt-4">{post.title}</h1>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <Badge>{categoryName}</Badge>
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
