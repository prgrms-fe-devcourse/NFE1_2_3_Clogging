'use client';
import React from 'react';
import BlogDataList from './BlogDataList';
import CustomLineChart from './LineChart';
import { useTheme } from '@/shared/providers/theme';

const BlogAnalytics = () => {
  const { isDarkMode } = useTheme();
  const data = [
    { date: '12/11/2024', uv: 24, pv: 30 },
    { date: '01/02/2023', uv: 31, pv: 28 },
    { date: '01/03/2023', uv: 15, pv: 22 },
    { date: '01/04/2023', uv: 28, pv: 19 },
    { date: '01/05/2023', uv: 19, pv: 25 },
  ];
  const cardStyle = ` w-full md:w-1/2 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`;
  return (
    <div>
      <BlogDataList />
      <div className={cardStyle}>
        <CustomLineChart data={data} />
      </div>
    </div>
  );
};

export default BlogAnalytics;
