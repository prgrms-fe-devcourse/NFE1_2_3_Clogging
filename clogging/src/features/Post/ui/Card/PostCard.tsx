import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/shared/ui/common/Card';
import { Badge } from '@/shared/ui/common/Badge';
import { Post } from '@/features/Post/types';
import { useState, useEffect } from 'react';
import { storage } from '@/shared/lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { useCommentCount } from '@/features/Comment/lib/hooks/useCommentCount';

interface Props {
  post: Post;
}

const PostCard = ({ post }: Props) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    '/images/card-thumbnail.png',
  );

  const { data: commentCount = 0 } = useCommentCount(post.id);

  useEffect(() => {
    const loadThumbnail = async () => {
      if (!post.image?.length) return;

      try {
        // 전체 URL인 경우 직접 사용
        if (post.image[0].startsWith('https://')) {
          setThumbnailUrl(post.image[0]);
          return;
        }

        // 파일명만 있는 경우 Storage에서 URL 가져오기
        if (post.image[0].length > 2) {
          // 최소 유효성 검사
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
    // string 대신 number 타입으로
    try {
      const date = new Date(timestamp); // 밀리초를 Date 객체로 변환

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
    <Link href={`/posts/${post.id}`}>
      <Card className="transition-all duration-200 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-primary/20 dark:hover:border-primary/30 min-w-[350px] border border-border/80 dark:border-border/5 overflow-hidden">
        <div>
          <CardContent className="-mt-6 -mx-6 mb-0">
            <div className="relative aspect-[4/3] w-full bg-secondary overflow-hidden">
              <div className="relative w-full h-full">
                <Image
                  src={thumbnailUrl}
                  alt={post.title || '게시글 썸네일'}
                  fill
                  priority // priority 추가
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  onError={() => {
                    setThumbnailUrl('/images/card-thumbnail.png');
                  }}
                />
              </div>
            </div>
          </CardContent>

          <div className="p-1 pt-4">
            <CardHeader className="flex flex-col items-start space-y-2 px-0">
              <CardTitle className="text-xl font-heading line-clamp-1">
                {post.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                {post.content.replace(/[#*\n]/g, ' ').trim()}
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-between px-0 pt-4">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{formatDate(post.createdAt)}</Badge>
                <Badge variant="secondary">{commentCount}개의 댓글</Badge>
                <Badge variant="secondary">
                  조회수 {(post.viewCount ?? 0).toLocaleString()}
                </Badge>
                {post.tags?.length > 0 && (
                  <Badge variant="secondary">
                    {post.tags[0]}
                    {post.tags.length > 1 ? ` +${post.tags.length - 1}` : ''}
                  </Badge>
                )}
              </div>
            </CardFooter>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PostCard;
