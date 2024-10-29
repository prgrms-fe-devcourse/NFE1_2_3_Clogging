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

interface Props {
  post: Post;
}

const PostCard = ({ post }: Props) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString)
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\. /g, '.')
      .replace('.', '년 ')
      .replace('.', '월 ')
      .replace('.', '일');
  };

  return (
    <Link href={`/posts/${post.id}`}>
      <Card className="transition-all duration-200 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-primary/20 dark:hover:border-primary/30 min-w-[350px] border border-border/80 dark:border-border/5 overflow-hidden">
        <div>
          {/* 썸네일 영역 */}
          <CardContent className="-mt-6 -mx-6 mb-0">
            <div className="relative aspect-[4/3] w-full bg-secondary overflow-hidden">
              <img
                src="/images/card-thumbnail.png" // 기본 썸네일 이미지 사용
                alt=""
                className="h-full w-full object-cover"
              />
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
              <div className="flex gap-2">
                <Badge variant="secondary">{formatDate(post.createdAt)}</Badge>
                <Badge variant="secondary">0개의 댓글</Badge>{' '}
                {/* 댓글 기능 추가 전까지 0으로 표시 */}
                <Badge variant="secondary">조회수 {post.viewCount}</Badge>
              </div>
            </CardFooter>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PostCard;
