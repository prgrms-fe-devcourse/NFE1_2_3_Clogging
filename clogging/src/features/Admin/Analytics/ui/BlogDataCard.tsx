import { cn } from '@/shared/lib/utils';
import { Card, CardContent } from '@/shared/ui/common/Card';
import Image from 'next/image';
import React from 'react';
import { BlogDataCardProps } from '../types';

const BlogDataCard: React.FC<BlogDataCardProps> = ({ label, value }) => (
  <Card
    className={cn(
      'p-3 flex-grow w-full sm:w-[calc(50%-8px)] md:w-[calc(20%-16px)] lg:w-[calc(20%-16px)] xl:w-[calc(20%-16px)]',
    )}
  >
    <CardContent className="flex items-center">
      <div className="w-10 h-10 rounded-full bg-[#F4F7FE] flex items-center justify-center mr-3">
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
    </CardContent>
  </Card>
);

export default BlogDataCard;
