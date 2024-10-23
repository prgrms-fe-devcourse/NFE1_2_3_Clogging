'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Search, User } from 'lucide-react';
import { Button } from './common/Button';
import CustomToggle from './CustomToggle';

export const Navigation = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system/saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    setIsDarkMode(savedTheme === 'dark' || (!savedTheme && systemDark));
  }, []);

  useEffect(() => {
    // Toggle dark class and save theme
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <nav
      className={cn(
        'w-full px-6 py-4',
        'border-b',
        'transition-colors duration-200',
        isDarkMode
          ? 'bg-gray-900 text-white border-gray-800'
          : 'bg-white text-gray-900 border-gray-200',
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center"
          style={{ width: 'auto', height: '59px' }}
        >
          <img
            className="w-full h-full"
            src="/images/clogging-logo.png"
            alt="클로깅 로고"
          />
        </div>

        {/* Navigation Items */}
        <div className="flex items-center space-x-6 gap-8">
          <span className="hover:text-blue-500 cursor-pointer transition-colors">
            피드
          </span>
          <Button
            variant="secondary"
            size="lg"
            className="rounded-full"
            style={{ margin: '0' }}
          >
            포스팅
          </Button>
          <button
            className="hover:text-blue-500 transition-colors"
            aria-label="검색"
            style={{ width: '30px', height: '30px', margin: '0' }}
          >
            <Search className="w-full h-full" />
          </button>
          <button
            className="hover:text-blue-500 transition-colors"
            aria-label="사용자 메뉴"
            style={{ width: '30px', height: '30px', margin: '0' }}
          >
            <User className="w-full h-full" />
          </button>
          <CustomToggle isActive={isDarkMode} onToggle={toggleDarkMode} />
        </div>
      </div>
    </nav>
  );
};
