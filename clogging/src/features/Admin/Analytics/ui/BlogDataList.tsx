import React from 'react';
import BlogDataCard from './BlogDataCard';

const BlogDataList = ({ adminData }) => {
  return (
    <div className="w-full flex flex-wrap justify-start gap-4">
      {adminData.map((item, index) => (
        <BlogDataCard key={index} label={item.label} value={item.value} />
      ))}
    </div>
  );
};

export default BlogDataList;
