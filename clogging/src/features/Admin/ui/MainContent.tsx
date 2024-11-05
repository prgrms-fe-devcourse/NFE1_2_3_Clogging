'use client';
import { ReactNode } from 'react';
import { useTheme } from '@/shared/providers/theme';
import { Card } from '@/shared/ui/common/Card';
import { cn } from '@/shared/lib/utils';
import { usePathname } from 'next/navigation';
import { menuItems } from '../constants';

interface MainContentProps {
  children: ReactNode;
}

export const MainContent = ({ children }: MainContentProps) => {
  const { isDarkMode } = useTheme();
  const pathname = usePathname();
  const currentMenuItem =
    menuItems.find((item) => item.href === pathname) || menuItems[0];

  return (
    <div className="w-full lg:mt-4 mb-8">
      <Card className={cn(`${isDarkMode ? 'bg-gray-800' : 'bg-[#F4F7FE]'}`)}>
        <h1 className="text-2xl font-bold mb-6">{currentMenuItem.name}</h1>
        {children}
      </Card>
    </div>
  );
};
