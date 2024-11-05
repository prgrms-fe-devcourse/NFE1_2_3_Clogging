// PostTableRow.jsx
import React, { useCallback } from 'react';
import { Badge } from '@/shared/ui/common/Badge';
import { useRouter } from 'next/navigation';

const PostTableRow = ({ post }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/posts/${post.id}`);
  };

  return (
    <tr
      onClick={handleClick}
      className="h-12 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
    >
      <td className="h-12 px-4 overflow-hidden">
        <div
          style={{
            maxWidth: '16vw',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {post.title}
        </div>
      </td>
      <td className="text-gray-500 dark:text-gray-400 overflow-hidden">
        <div
          style={{
            maxWidth: '30vw',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {post.content}
        </div>
      </td>
      <td className="px-2">
        <Badge variant="secondary">{post.viewCount}</Badge>
      </td>
    </tr>
  );
};

export default PostTableRow;
