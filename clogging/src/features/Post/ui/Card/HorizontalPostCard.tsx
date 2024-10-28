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

interface Props {
  post: Post;
}

const HorizontalPostCard = ({ post }: Props) => {
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
    <Link href={`/posts/${post.id}`} className="block max-w-5xl">
      <Card className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-primary/20 dark:hover:border-primary/30">
        {' '}
        {/* overflow-hidden 추가 */}
        <CardContent className="p-0">
          <div className="flex">
            <div className="flex-1 p-2">
              {' '}
              {/* 패딩 살짝 늘림 */}
              <div className="flex flex-col gap-3 items-start justify-between mb-2">
                <Badge variant="secondary">카테고리</Badge>
                <CardTitle className="text-xl font-heading truncate w-full">
                  {' '}
                  {/* truncate로 한 줄 처리 */}
                  {post.title}
                </CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground mb-4 overflow-hidden line-clamp-2 min-h-[40px]">
                {post.content.replace(/[#*\n]/g, ' ').trim()}
              </CardDescription>
              <div className="flex gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
              <CardFooter className="justify-between px-0 pt-4 border-t">
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {formatDate(post.createdAt)}
                  </Badge>
                  <Badge variant="secondary">0개의 댓글</Badge>{' '}
                  {/*목데이터 상에 댓글 카운트가 없어서 일단 0개로 설정*/}
                  <Badge variant="secondary">조회수 {post.viewCount}</Badge>
                </div>
              </CardFooter>
            </div>
            <div className="w-80 relative rounded-r-lg overflow-hidden">
              {' '}
              {/* 오른쪽 radius 추가 */}
              <img
                src="/images/card-thumbnail.png"
                alt="Featured"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default HorizontalPostCard;
