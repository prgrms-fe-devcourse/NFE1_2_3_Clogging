// PostTable.jsx
import React from 'react';
import PostTableRow from './PostTableRow';

const PostTable = ({ posts }) => (
  <div className="overflow-hidden rounded-md mb-8 border">
    <table className="min-w-full">
      <thead>
        <tr
          className="rounded h-12 bg-gray-50 dark:bg-gray-600"
          style={{ borderRadius: '20px' }}
        >
          <th className="w-44 pl-4 text-left">제목</th>
          <th className="text-left">내용</th>
          <th className="text-left">조회수</th>
        </tr>
      </thead>
      <tbody className="bg-gray-100 dark:bg-gray-800">
        {posts.map((post) => (
          <PostTableRow key={post.id} post={post} />
        ))}
      </tbody>
    </table>
  </div>
);

export default PostTable;
