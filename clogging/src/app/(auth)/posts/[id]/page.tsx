// 게시물 상세
import { Detail } from '@/features/Post/ui/Detail/index';
import { Suspense } from 'react';

interface PostPageProps {
  params: {
    id: string;
  };
}

export default async function PostDetailPage({ params }: PostPageProps) {
  // params를 await 합니다
  const { id } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Detail postId={id} />
    </Suspense>
  );
}
