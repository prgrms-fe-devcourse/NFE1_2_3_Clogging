import { Post } from '@/features/Post/types';
import { Badge } from '@/shared/ui/common/Badge';
import { elapsedTime } from '../../../../shared/lib/utils/elapsedTimeCalculation';
import { useCategories } from '@/features/Category/hooks';
import { Button } from '@/shared/ui/common/Button';
import { deletePost } from '../../api/postApi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const Header = ({ post }: { post: Post }) => {
  const { categories, fetchCategories } = useCategories();
  const [categoryName, setCategoryName] = useState<string>('카테고리');
  const { getCategoryName } = useCategories();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

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
    <header className="mb-8">
      <div className="flex justify-between items-start">
        <h1 className="text-4xl font-bold mt-4">{post.title}</h1>
        <div className="flex gap-2">
          <Button onClick={handleEdit}>수정</Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
        <Badge>{getCategoryName(post.categoryId)}</Badge>
        <h1 className="text-4xl font-bold mt-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <Badge>{categoryName}</Badge>
          <span>|</span>
          <span>|</span>
          <time>{elapsedTime(new Date(post.createdAt).toISOString())}</time>
        </div>
        {post.tags?.map((tag) => (
          <span key={tag} className="px-2 py-1 text-sm bg-gray-100 rounded">
            {tag}
          </span>
        ))}
      </div>
    </header>
  );
};
