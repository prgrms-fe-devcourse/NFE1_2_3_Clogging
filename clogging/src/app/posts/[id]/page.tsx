// app/posts/[id]/page.tsx
import { PostDetailWidget } from '@/widgets/post/PostDetailWidget';
import { Suspense } from 'react';

interface PostPageProps {
  params: {
    id: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  // params를 await 합니다
  const { id } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostDetailWidget postId={id} />
    </Suspense>
  );
}
