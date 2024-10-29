'use client';

import { Form } from '@/features/Comment/ui/Form';
import { usePost } from '../../hooks';
import { TableOfContents } from '../TableOfContents';
import { Content } from './Content';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { List } from '@/features/Comment/ui/List';
import { useInvalidateComments } from '@/features/Comment/hooks';

export const Detail = ({ postId }: { postId: string }) => {
  const { data: post, isLoading, error } = usePost(postId);
  const invalidateComments = useInvalidateComments(postId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!post) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-12 gap-8">
        <main className="col-span-9">
          <article className="prose lg:prose-xl max-w-none">
            <Header post={post} />
            <Content post={post} />
          </article>
          <Navigation currentPostId={postId} />
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">댓글</h2>
            <Form
              postId={postId}
              onSuccess={() => {
                invalidateComments();
              }}
            />
            <div className="mt-8">
              <List postId={postId} />
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
