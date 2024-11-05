import { Badge } from '@/shared/ui/common/Badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/common/Card';
import React, { useState } from 'react';

const PostListSection = ({ postData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  // Calculate total pages
  const totalPages = Math.ceil(postData.length / postsPerPage);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = postData.slice(indexOfFirstPost, indexOfLastPost);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="h-full">
      {/* List Card */}
      <Card className="shadow-lg h-full">
        <CardHeader>
          <CardTitle>최근 포스트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full bg-gray-50 dark:bg-gray-700 shadow-md">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-800 rounded-md ">
                  <th className="w-1/4 p-4 text-left">제목</th>
                  <th className="w-1/2 p-4 text-left">내용</th>
                  <th className="w-1/4 p-4 text-left">조회수</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.map((item) => (
                  <tr
                    key={item.title}
                    className="border-b border-gray-300 dark:border-gray-600"
                  >
                    <td className="w-1/3 p-4">{item.title}</td>
                    <td className="w-1/3 p-4 text-sm text-gray-500 dark:text-gray-400 truncate text-wrap overflow-hidden">
                      {item.content}
                    </td>
                    <td className="w-1/3 p-4">
                      <Badge variant="secondary">{item.viewCount}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 bg-blue-500 text-white rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                이전
              </button>

              <span>{`${currentPage} / ${totalPages}`}</span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 bg-blue-500 text-white rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                다음
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostListSection;
