'use client';
import { ReactNode } from 'react'; // ReactNode 타입을 import합니다.
import { useTheme } from '@/shared/providers/theme';
import { Card } from '@/shared/ui/common/Card';
import { cn } from '@/shared/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}
export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`flex h-[calc(100vh-90px)] ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-[#2B3674]'}`}
    >
      <div className="w-full mt-4">
        <Card
          className={cn(
            `h-auto ${isDarkMode ? 'bg-gray-800' : 'bg-[#F4F7FE]'}`,
          )}
        >
          {children}
        </Card>
      </div>
    </div>
  );
}
