// BlogDataSection.tsx
import React from 'react';
import BlogDataList from '@/features/Admin/Analytics/ui/BlogDataList';

interface BlogDataSectionProps {
  adminData: any; // Replace 'any' with the appropriate type for adminData
}

const BlogDataSection: React.FC<BlogDataSectionProps> = ({ adminData }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {adminData && <BlogDataList adminData={adminData} />}
    </div>
  );
};

export default BlogDataSection;
