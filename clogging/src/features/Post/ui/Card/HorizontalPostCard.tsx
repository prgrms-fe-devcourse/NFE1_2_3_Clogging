import Link from 'next/link';
import {
  Card,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/shared/ui/common/Card';
import { Badge } from '@/shared/ui/common/Badge';
import { Post } from '@/features/Post/types';
import { useState, useEffect } from 'react';
import { storage, db } from '@/shared/lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';
import { useCommentCount } from '@/features/Comment/api/useCommentCount';
import { useRealtimeViewCount } from '@/features/Post/hooks';

interface Props {
  post: Post;
}

const HorizontalPostCard = ({ post }: Props) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    '/images/card-thumbnail.png',
  );
  const [categoryName, setCategoryName] = useState<string>('카테고리');
  const { data: viewCount = post.viewCount ?? 0 } = useRealtimeViewCount(
    post.id,
  );
  const { data: commentCount = 0 } = useCommentCount(post.id);

  useEffect(() => {
    const loadCategoryName = async () => {
      if (!post.category) return;

      try {
        const categoryDoc = await getDoc(doc(db, 'categories', post.category));
        if (categoryDoc.exists()) {
          const categoryData = categoryDoc.data();
          setCategoryName(categoryData.name || '카테고리');
        }
      } catch (error) {
        console.error('카테고리 로드 실패:', error);
      }
    };

    loadCategoryName();
  }, [post.category]);

  useEffect(() => {
    const loadThumbnail = async () => {
      if (
        !post.image ||
        !Array.isArray(post.image) ||
        post.image.length === 0
      ) {
        setThumbnailUrl('/images/card-thumbnail.png');
        return;
      }

      try {
        const imageUrl = post.image[0];

        if (imageUrl.startsWith('https://')) {
          setThumbnailUrl(imageUrl);
          return;
        }

        if (
          imageUrl &&
          typeof imageUrl === 'string' &&
          imageUrl.trim().length > 0
        ) {
          const imageRef = ref(storage, `posts/${imageUrl}`);
          try {
            const url = await getDownloadURL(imageRef);
            setThumbnailUrl(url);
          } catch (storageError) {
            console.log('Storage error for:', imageUrl, storageError);
            setThumbnailUrl('/images/card-thumbnail.png');
          }
        } else {
          setThumbnailUrl('/images/card-thumbnail.png');
        }
      } catch (error) {
        console.error('썸네일 로드 실패:', post.image[0], error);
        setThumbnailUrl('/images/card-thumbnail.png');
      }
    };

    loadThumbnail();
  }, [post.image]);

  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp);

      return date
        .toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/\. /g, '.')
        .replace('.', '년 ')
        .replace('.', '월 ')
        .replace('.', '일');
    } catch (error) {
      console.error('날짜 변환 실패:', error);
      return '날짜 정보 없음';
    }
  };

  return (
    <Link href={`/posts/${post.id}`} className="block max-w-full">
      <Card className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-primary/20 dark:hover:border-primary/30">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            <div className="flex-1 p-2">
              <div className="flex flex-col gap-3 items-start justify-between mb-2">
                <Badge variant="secondary">{categoryName}</Badge>
                <CardTitle className="text-lg md:text-xl font-heading truncate w-full">
                  {post.title}
                </CardTitle>
              </div>
              <CardDescription className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 overflow-hidden line-clamp-2 min-h-[40px]">
                {post.content.replace(/[#*\n]/g, ' ').trim()}
              </CardDescription>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} className="text-xs sm:text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <CardFooter className="flex-wrap justify-start sm:justify-between gap-2 px-0 pt-3 sm:pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    {formatDate(post.createdAt)}
                  </Badge>
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    {commentCount}개의 댓글
                  </Badge>
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    조회수 {viewCount.toLocaleString()}
                  </Badge>
                </div>
              </CardFooter>
            </div>
            <div className="w-full sm:w-48 md:w-64 lg:w-80 relative rounded-b-lg sm:rounded-r-lg overflow-hidden aspect-[4/3]">
              <img
                src={thumbnailUrl}
                alt={post.title || '게시글 썸네일'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.log('Image load error for:', target.src);
                  setThumbnailUrl('/images/card-thumbnail.png');
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default HorizontalPostCard;
