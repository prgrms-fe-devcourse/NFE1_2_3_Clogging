// PostTable.jsx
import React from 'react';
import PostTableRow from './PostTableRow';

const PostTable = ({ posts }) => (
  <table className="min-w-full mb-8 bg-gray-50 dark:bg-gray-700">
    <thead>
      <tr className="rounded-lg h-12 bg-gray-200 dark:bg-gray-800 rounded-lg">
        <th className="w-44 pl-4 text-left">제목</th>
        <th className="text-left">내용</th>
        <th className="text-left">조회수</th>
      </tr>
    </thead>
    <tbody className="bg-gray-100 dark:bg-gray-700">
      {posts.map((post) => (
        <PostTableRow key={post.id} post={post} />
      ))}
    </tbody>
  </table>
);

export default PostTable;
