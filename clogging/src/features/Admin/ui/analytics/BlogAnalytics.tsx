'use client';
import React, { useRef, useEffect, useState } from 'react';
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

  const cardStyle = `w-full md:w-1/2 p-2 rounded-md ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`;

  // Ref to get the parent div's width
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // State to hold the calculated width
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    if (chartContainerRef.current) {
      setChartWidth(chartContainerRef.current.offsetWidth); // Set width based on parent div
    }

    const handleResize = () => {
      if (chartContainerRef.current) {
        setChartWidth(chartContainerRef.current.offsetWidth); // Update width on resize
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <div className="mb-6">
        <BlogDataList />
      </div>
      <div className="flex">
        <div className={`mr-2 ${cardStyle}`} ref={chartContainerRef}>
          <h2 className="mb-4 text-lg">월별 댓글 추이</h2>
          <CustomLineChart data={data} width={chartWidth} />
        </div>
        <div className={cardStyle} ref={chartContainerRef}>
          <h2 className="mb-4 text-lg">월별 조회수</h2>
          <CustomLineChart data={data} width={chartWidth} />
        </div>
      </div>
    </div>
  );
};

export default BlogAnalytics;
