import React from 'react';
import BlogDataCard from './BlogDataCard';

const adminData = [
  { label: '포스트 수', value: '100 개' },
  { label: '댓글 수', value: '121 개' },
  { label: '총 조회 수', value: '121 회' },
  { label: '총 조회 수', value: '121 회' },
  { label: '총 조회 수', value: '121 회' },
];
const BlogDataList = () => {
  return (
    <div className="flex flex-wrap justify-start gap-4">
      {adminData.map((item, index) => (
        <BlogDataCard key={index} label={item.label} value={item.value} />
      ))}
    </div>
  );
};

export default BlogDataList;
