'use client';
import React from 'react';
import BlogDataList from './BlogDataList';
import CustomLineChart from './LineChart';
import { useTheme } from '@/shared/providers/theme';
import CustomAreaChart from './AreaChart';
import PostingCalendar from './PostingCalendar';

const BlogAnalytics = () => {
  const { isDarkMode } = useTheme();
  const data = [
    { date: '12/11/2024', uv: 24, pv: 30 },
    { date: '01/02/2023', uv: 31, pv: 28 },
    { date: '01/03/2023', uv: 15, pv: 22 },
    { date: '01/04/2023', uv: 28, pv: 19 },
    { date: '01/05/2023', uv: 19, pv: 25 },
  ];

  const cardStyle = `flex flex-col w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`;
  const calendarStyle = ` p-2 rounded-md ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`;

  return (
    <div>
      <div className="mb-10">
        <BlogDataList />
      </div>
      <div className="flex flex-col md:flex-row mb-6 space-y-6 md:space-y-0 md:space-x-6">
        <div className={`${cardStyle} w-full md:w-1/2`}>
          <h2 className="mb-4 text-lg">일별 댓글 추이</h2>
          <CustomLineChart data={data} />
        </div>
        <div className={`${cardStyle} w-full md:w-1/2`}>
          <h2 className="mb-4 text-lg">일별 조회수</h2>
          <CustomAreaChart />
        </div>
      </div>
      <div className={calendarStyle}>
        <PostingCalendar />
      </div>
    </div>
  );
};

export default BlogAnalytics;
