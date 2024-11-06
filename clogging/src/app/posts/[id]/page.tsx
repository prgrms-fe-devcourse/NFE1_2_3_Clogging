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
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary"></div>
        </div>
      }
    >
      <Detail postId={id} />
    </Suspense>
  );
}
