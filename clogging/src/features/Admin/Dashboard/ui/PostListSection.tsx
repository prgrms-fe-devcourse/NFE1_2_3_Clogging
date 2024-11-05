// PostListSection.jsx (메인 컴포넌트)
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/shared/ui/common/Card';
import PostTable from './PostTable';
import Pagination from './Pagination';

const PostListSection = ({ postData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  const totalPages = Math.ceil(postData.length / postsPerPage);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = postData.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Card className="rounded-lg shadow-sm bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle>최근 포스트</CardTitle>
      </CardHeader>
      <div className="text-xs">
        <PostTable posts={currentPosts} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </Card>
  );
};

export default PostListSection;
