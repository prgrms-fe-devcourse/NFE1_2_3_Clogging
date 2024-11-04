import Image from 'next/image';
import React from 'react';
import { BlogDataCardProps } from '../types';
import { useTheme } from '@/shared/providers/theme';

const BlogDataCard: React.FC<BlogDataCardProps> = ({ label, value }) => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`p-4 rounded-md flex-grow w-full sm:w-[calc(50%-8px)] md:w-[calc(20%-16px)] lg:w-[calc(20%-16px)] xl:w-[calc(20%-16px)] 
       ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}
    >
      <div className="flex items-center">
        {' '}
        {/* Center-align content */}
        <div className="w-10 h-10 rounded-full bg-[#F4F7FE] flex items-center justify-center mr-6">
          <Image
            src="/icons/admin_analytics.png"
            alt={label}
            width={24}
            height={24}
          />
        </div>
        <div>
          <div className="text-xs text-gray-400">{label}</div>
          <div className="text-lg font-semibold">{value}</div>
        </div>
      </div>
    </div>
  );
};

export default BlogDataCard;