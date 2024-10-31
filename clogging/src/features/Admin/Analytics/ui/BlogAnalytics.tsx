// src/features/Admin/ui/analytics/BlogAnalytics.tsx
'use client';
import React from 'react';
import BlogDataList from './BlogDataList';
import { useTheme } from '@/shared/providers/theme';
import PostingCalendar from './PostingCalendar';
import CustomBarChart from './CustomBarChart';
import NivoLineChart from './CustomLineChart';

interface BlogAnalyticsProps {
  data: {
    adminData: Array<{ label: string; value: string }>;
    viewsData: Array<{ date: string; views: number }>;
    lineData: Array<{
      id: string;
      color: string;
      data: Array<{ x: string; y: number }>;
    }>;
  };
}

const BlogAnalytics: React.FC<BlogAnalyticsProps> = ({ data }) => {
  const { isDarkMode } = useTheme();
  const { adminData, viewsData, lineData } = data;
  console.log(data);
  const calendarStyle = ` p-2 rounded-md ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`;
  const cardStyle = `w-full md:w-1/2 p-2`;

  return (
    <div>
      <div className="mb-10">
        <BlogDataList adminData={adminData} />
      </div>
      <div className="flex flex-col md:flex-row md:flex-wrap mb-6">
        <div className={`${cardStyle}`}>
          <h2>월별 조회수</h2>
          <CustomBarChart data={viewsData} />
        </div>
        <div className={`${cardStyle}`}>
          <h2>월별 댓글수</h2>
          <NivoLineChart data={lineData} />
        </div>
      </div>
      <div className={calendarStyle}>
        <h2 className="mb-6">Posting Calendar</h2>
        <PostingCalendar />
      </div>
    </div>
  );
};

export default BlogAnalytics;
