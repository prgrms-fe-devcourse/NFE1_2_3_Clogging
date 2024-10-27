import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/common/Card';
import { Badge } from '@/components/ui/common/Badge';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  comments: number;
  views: number;
  thumbnailUrl: string;
  url: string;
}

interface Props {
  post: Post;
}

const PostCard = ({ post }: Props) => {
  return (
    <Link href={`/posts/${post.id}`}>
      <Card className="transition-all duration-200 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-primary/20 dark:hover:border-primary/30 min-w-[350px] border border-border/80 dark:border-border/5 overflow-hidden">
        <div>
          {/* 썸네일 영역 */}
          <CardContent className="-mt-6 -mx-6 mb-0">
            <div className="relative aspect-[4/3] w-full bg-secondary overflow-hidden">
              <img
                src={post.thumbnailUrl}
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
              <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                {post.excerpt}
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-between px-0 pt-4">
              <div className="flex gap-2">
                <Badge variant="secondary">{post.date}</Badge>
                <Badge variant="secondary">{post.comments}개의 댓글</Badge>
                <Badge variant="secondary">조회수 {post.views}</Badge>
              </div>
            </CardFooter>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PostCard;
