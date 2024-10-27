// 본문 내용

import { Post } from '@/features/Post/types';

export const Header = ({ post }: { post: Post }) => {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Category: {post.categoryId}</span>
        <span>•</span>
        <span>Views: {post.viewCount}</span>
        <span>•</span>
        <time>{new Date(post.createdAt).toLocaleDateString()}</time>
      </div>
      <h1 className="mt-4">{post.title}</h1>
      <div className="flex gap-2 mt-4">
        {post.tags.map((tag) => (
          <span key={tag} className="px-2 py-1 text-sm bg-gray-100 rounded">
            {tag}
          </span>
        ))}
      </div>
    </header>
  );
};
