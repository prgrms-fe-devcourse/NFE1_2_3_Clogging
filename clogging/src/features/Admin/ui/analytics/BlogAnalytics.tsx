'use client';
import React from 'react';
import BlogDataList from './BlogDataList';
import { useTheme } from '@/shared/providers/theme';
import PostingCalendar from './PostingCalendar';
import CustomBarChart from './CustomBarChart';
import NivoLineChart from './CustomLineChart';

const BlogAnalytics = () => {
  const { isDarkMode } = useTheme();
  const viewsData = [
    { date: '2024-01', views: 200 },
    { date: '2024-02', views: 300 },
    { date: '2024-03', views: 400 },
    { date: '2024-04', views: 350 },
  ];
  const lineData = [
    {
      id: '조회수',
      color: 'hsl(213, 70%, 50%)',
      data: [
        { x: '2024-01', y: 200 },
        { x: '2024-02', y: 300 },
        { x: '2024-03', y: 400 },
        { x: '2024-04', y: 350 },
      ],
    },
    {
      id: '댓글 수',
      color: 'hsl(120, 70%, 50%)',
      data: [
        { x: '2024-01', y: 100 },
        { x: '2024-02', y: 150 },
        { x: '2024-03', y: 200 },
        { x: '2024-04', y: 180 },
      ],
    },
  ];
  const calendarStyle = ` p-2 rounded-md ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`;
  const cardStyle = `w-full md:w-1/2 p-2`;
  return (
    <div>
      <div className="mb-10">
        <BlogDataList />
      </div>
      <div className="flex flex-col md:flex-row md:flex-wrap">
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
        <PostingCalendar />
      </div>
    </div>
  );
};

export default BlogAnalytics;
