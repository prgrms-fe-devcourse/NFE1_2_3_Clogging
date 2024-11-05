import { Post } from '@/features/Post/types';
import { Badge } from '@/shared/ui/common/Badge';
import { elapsedTime } from '../../../../shared/lib/utils/elapsedTimeCalculation';
import { useCategories } from '@/features/Category/hooks';
import { Button } from '@/shared/ui/common/Button';
import { deletePost } from '../../api/postApi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRealtimeViewCount } from '../../hooks';

export const Header = ({ post }: { post: Post }) => {
  const { categories, fetchCategories } = useCategories();
  const [categoryName, setCategoryName] = useState<string>('카테고리');
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: viewCount = post.viewCount ?? 0 } = useRealtimeViewCount(
    post.id,
  );

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

  const handleEdit = () => {
    router.push(`/posts/${post.id}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deletePost(post.id);
      router.push('/posts');
    } catch (error) {
      console.error('게시물 삭제 중 오류 발생:', error);
      alert('게시물 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <header className="mb-4 md:mb-8">
      <div className="flex sm:flex-row sm:items-center gap-4 justify-between">
        <h1 className="text-2xl md:text-4xl font-bold break-words">
          {post.title}
        </h1>
        <div className="flex gap-2 items-center shrink-0">
          <Button onClick={handleEdit} variant="ghost" size="sm">
            수정
          </Button>
          <span className="text-gray-400">|</span>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="ghost"
            size="sm"
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </Button>
        </div>
      </div>
      <div className="flex flex-row md:flex-col justify-between gap-3 md:gap-4 text-sm text-gray-500 mt-3 md:mt-4">
        <div className="flex flex-wrap gap-2 md:gap-4 text-sm text-gray-500 items-center">
          <Badge>{categoryName}</Badge>
          <span className="hidden md:inline text-gray-400">|</span>
          <Badge variant="secondary">조회수 {viewCount.toLocaleString()}</Badge>
          <span className="hidden md:inline text-gray-400">|</span>
          <time>{elapsedTime(new Date(post.createdAt).toISOString())}</time>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-4 text-sm text-gray-500 items-center">
          {post.tags?.map((tag) => (
            <Badge
              key={tag}
              className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded dark:text-gray-300"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </header>
  );
};
