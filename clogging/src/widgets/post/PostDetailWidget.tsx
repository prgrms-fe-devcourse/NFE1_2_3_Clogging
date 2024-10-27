'use client';

import { PostContent } from '@/entities/post/ui/PostContent';
import { TableOfContents } from '@/entities/post/ui/TableOfContents';
import { PostNavigationWidget } from '@/widgets/post/PostNavigationWidget';
import { usePost } from '@/entities/post/model/post';
import { CommentForm } from '@/entities/comment/ui/CommentForm';
import { CommentList } from '@/entities/comment/ui/CommentList';

export const PostDetailWidget = ({ postId }: { postId: string }) => {
  const { data: post, isLoading, error } = usePost(postId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!post) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-12 gap-8">
        <main className="col-span-9">
          <PostContent post={post} />
          <PostNavigationWidget currentPostId={postId} />
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Comments</h2>
            <CommentForm postId={postId} />
            <div className="mt-8">
              <CommentList postId={postId} />
            </div>
          </section>
        </main>
        <aside className="col-span-3">
          <TableOfContents />
        </aside>
      </div>
    </div>
  );
};
