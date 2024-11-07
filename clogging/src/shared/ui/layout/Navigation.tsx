'use client';

import { cn } from '@/shared/lib/utils';
import { Search, User, Menu, X } from 'lucide-react';
import { Button } from '../common/Button';
import { useTheme } from '@/shared/providers/theme';
import Link from 'next/link';
import Toggle from '../common/Toggle';
import { useAuth } from '@/features/Admin/hooks/useAuth';
import { useAdminStore } from '@/features/Admin/stores/useAdminStore';
import { useState, useEffect, useRef } from 'react';

export const Navigation = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  console.log('Current Role:', useAdminStore.getState().isAdmin); // 디버깅용
  console.log('Is Admin:', isAdmin);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={cn(
        'w-full sm:px-6 py-3 sm:py-4',
        'border-b',
        'transition-colors duration-200',
        'overflow-hidden',
        'fixed top-0 left-0 right-0 z-50',
        isDarkMode
          ? 'bg-gray-900 text-white border-gray-800'
          : 'bg-white text-gray-900 border-gray-200',
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="flex items-center">
          <div className="h-10 sm:h-[59px] w-auto">
            <img
              className="w-full h-full"
              src={
                isDarkMode
                  ? '/icons/clogging-dark.png'
                  : '/icons/clogging-light.png'
              }
              alt="클로깅 로고"
            />
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴'}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Navigation Items - Desktop */}
        <div className="hidden lg:flex items-center space-x-6 gap-8">
          <Link href="/posts" className="flex items-center">
            <span className="hover:text-blue-500 cursor-pointer transition-colors">
              피드
            </span>
          </Link>

          {isAdmin && (
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
          )}

          <Link href="/search" className="flex items-center">
            <button
              className="hover:text-blue-500 transition-colors"
              aria-label="검색"
              style={{ width: '30px', height: '30px', margin: '0' }}
            >
              <Search className="w-full h-full" />
            </button>
          </Link>

          {isAdmin && (
            <Link href="/admin" className="flex items-center">
              <button
                className="hover:text-blue-500 transition-colors"
                aria-label="사용자 메뉴"
                style={{ width: '30px', height: '30px', margin: '0' }}
              >
                <User className="w-full h-full" />
              </button>
            </Link>
          )}

          <Toggle isActive={isDarkMode} onToggle={toggleDarkMode} />
        </div>

        {/* Mobile Menu - Dropdown */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="lg:hidden fixed top-[57px] sm:top-[73px] left-0 right-0 p-4 z-50 border-b shadow-lg transition-all duration-200 ease-in-out"
            style={{
              backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
              borderColor: isDarkMode ? '#374151' : '#E5E7EB',
            }}
          >
            <div className="flex flex-col space-y-4">
              <Link href="/posts" className="flex items-center">
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full w-full"
                >
                  피드
                </Button>
              </Link>

              {isAdmin && (
                <Link href="/posting" className="flex items-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full w-full"
                  >
                    포스팅
                  </Button>
                </Link>
              )}

              {isAdmin && (
                <Link href="/admin">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full w-full"
                  >
                    <User className="w-6 h-6" />
                  </Button>
                </Link>
              )}

              <Link href="/search">
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full w-full"
                >
                  <Search className="w-6 h-6" />
                </Button>
              </Link>

              <div className="flex items-center justify-end w-full">
                <Toggle isActive={isDarkMode} onToggle={toggleDarkMode} />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
