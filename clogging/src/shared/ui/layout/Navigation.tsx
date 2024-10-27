'use client';

import { cn } from '@/shared/lib/utils';
import { Search, User } from 'lucide-react';
import { Button } from '../common/Button';
import { useTheme } from '@/shared/providers/theme';
import Link from 'next/link';
import Toggle from '../common/Toggle';

export const Navigation = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <nav
      className={cn(
        'w-full px-6 py-4',
        'border-b',
        'transition-colors duration-200',
        'ovflow-hidden',
        isDarkMode
          ? 'bg-gray-900 text-white border-gray-800'
          : 'bg-white text-gray-900 border-gray-200',
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="flex items-center">
          <div style={{ width: 'auto', height: '59px' }}>
            <img
              className="w-full h-full"
              src="/images/clogging-logo.png"
              alt="클로깅 로고"
            />
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-6 gap-8">
          <Link href="/feed" className="flex items-center">
            <span className="hover:text-blue-500 cursor-pointer transition-colors">
              피드
            </span>
          </Link>
          <Link href="/posting" className="flex items-center">
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full"
              style={{ margin: '0' }}
            >
              포스팅
            </Button>
          </Link>
          <Link href="/search" className="flex items-center">
            <button
              className="hover:text-blue-500 transition-colors"
              aria-label="검색"
              style={{ width: '30px', height: '30px', margin: '0' }}
            >
              <Search className="w-full h-full" />
            </button>
          </Link>
          <Link href="/admin" className="flex items-center">
            <button
              className="hover:text-blue-500 transition-colors"
              aria-label="사용자 메뉴"
              style={{ width: '30px', height: '30px', margin: '0' }}
            >
              <User className="w-full h-full" />
            </button>
          </Link>
          <Toggle isActive={isDarkMode} onToggle={toggleDarkMode} />
        </div>
      </div>
    </nav>
  );
};
