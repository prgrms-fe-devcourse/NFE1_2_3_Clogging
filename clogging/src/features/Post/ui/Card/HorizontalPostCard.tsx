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
import { storage } from '@/shared/lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { useCommentCount } from '@/features/Comment/lib/hooks/useCommentCount';
import { useRealtimeViewCount } from '@/features/Post/hooks';

interface Props {
  post: Post;
}

const HorizontalPostCard = ({ post }: Props) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    '/images/card-thumbnail.png',
  );
  const { data: viewCount = post.viewCount ?? 0 } = useRealtimeViewCount(
    post.id,
  );
  const { data: commentCount = 0 } = useCommentCount(post.id);

  useEffect(() => {
    const loadThumbnail = async () => {
      if (!post.image?.length) return;

      try {
        if (post.image[0].startsWith('https://')) {
          setThumbnailUrl(post.image[0]);
          return;
        }

        if (post.image[0].length > 2) {
          const imageRef = ref(storage, `posts/${post.image[0]}`);
          const url = await getDownloadURL(imageRef);
          setThumbnailUrl(url);
        }
      } catch (error) {
        console.error('썸네일 로드 실패:', error);
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
    <Link href={`/posts/${post.id}`} className="block max-w-5xl">
      <Card className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-primary/20 dark:hover:border-primary/30">
        <CardContent className="p-0">
          <div className="flex">
            <div className="flex-1 p-2">
              <div className="flex flex-col gap-3 items-start justify-between mb-2">
                <Badge variant="secondary">
                  {post.categoryId || '카테고리'}
                </Badge>
                <CardTitle className="text-xl font-heading truncate w-full">
                  {post.title}
                </CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground mb-4 overflow-hidden line-clamp-2 min-h-[40px]">
                {post.content.replace(/[#*\n]/g, ' ').trim()}
              </CardDescription>
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              )}
              <CardFooter className="justify-between px-0 pt-4 border-t">
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {formatDate(post.createdAt)}
                  </Badge>
                  <Badge variant="secondary">{commentCount}개의 댓글</Badge>
                  <Badge variant="secondary">
                    조회수 {viewCount.toLocaleString()}
                  </Badge>
                </div>
              </CardFooter>
            </div>
            <div className="w-80 relative rounded-r-lg overflow-hidden">
              <img
                src={thumbnailUrl}
                alt={post.title || '게시글 썸네일'}
                className="absolute inset-0 w-full h-full object-cover"
                onError={() => {
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
