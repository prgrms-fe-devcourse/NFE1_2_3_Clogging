// BlogAnalytics.tsx
'use client';
import React from 'react';
import BlogDataList from './BlogDataList';
import { useTheme } from '@/shared/providers/theme';
import PostingCalendar from './PostingCalendar';
import CustomBarChart from './CustomBarChart';
import NivoLineChart from './CustomLineChart';
import { BlogAnalyticsProps } from '../types';
import CustomBumpChart from './CustomBumpChart';

const BlogAnalytics: React.FC<BlogAnalyticsProps> = ({ data }) => {
  const { isDarkMode } = useTheme();
  const { adminData, postingData, lineData, calendarData } = data;
  const calendarStyle = ` p-2 rounded-md ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`;
  const cardStyle = `w-full md:w-[calc(50%-0.5rem)]`; // 너비를 조정하여 간격 확보
  const firstCardStyle = 'md:mr-4'; // 첫 번째 카드에 오른쪽 마진 추가

  return (
    <div>
      <div className="mb-10">
        <BlogDataList adminData={adminData} />
      </div>
      <div className="flex flex-col md:flex-row md:flex-wrap mb-6">
        <div className={`${cardStyle} ${firstCardStyle} mb-4 md:mb-0`}>
          <CustomBarChart data={postingData} />
        </div>
        <div className={`${cardStyle}`}>
          <NivoLineChart data={lineData} />
        </div>
      </div>
      <div className={calendarStyle}>
        <h2 className="mb-6">Posting Calendar</h2>
        <PostingCalendar calendarData={calendarData} />
      </div>
    </div>
  );
};

export default BlogAnalytics;
