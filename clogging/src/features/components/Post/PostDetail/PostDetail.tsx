// 게시물 상세

'use client';

import { PostTableOfContents } from '@/features/components/Post/PostTableOfContents';
import { usePost } from '@/features/components/Post/model/post';
import { CommentForm } from '@/features/components/Comment/CommentForm';
import { CommentList } from '@/features/components/Comment/CommentList';
import { PostDetailContent } from './PostDetailContent';
import { PostDetailHeader } from './PostDetailHeader';
import { PostDetailNavigation } from './PostDetailNavigation';

export const PostDetail = ({ postId }: { postId: string }) => {
  const { data: post, isLoading, error } = usePost(postId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!post) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-12 gap-8">
        <main className="col-span-9">
          <article className="prose lg:prose-xl max-w-none">
            <PostDetailHeader post={post} />
            <PostDetailContent post={post} />
          </article>
          <PostDetailNavigation currentPostId={postId} />
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Comments</h2>
            <CommentForm postId={postId} />
            <div className="mt-8">
              <CommentList postId={postId} />
            </div>
          </section>
        </main>
        <aside className="col-span-3">
          <PostTableOfContents />
        </aside>
      </div>
    </div>
  );
};
