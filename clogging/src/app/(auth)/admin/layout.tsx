'use client';
import { ReactNode } from 'react'; // ReactNode 타입을 import합니다.
import { useTheme } from '@/shared/providers/theme';
import { Card } from '@/shared/ui/common/Card';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

interface MenuItem {
  name: string;
  icon: string;
  activeIcon: string;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    icon: '/icons/admin_dashboard.png',
    activeIcon: '/icons/admin_dashboard_act.png',
    href: '/admin',
  },
  {
    name: '통계',
    icon: '/icons/admin_analytics.png',
    activeIcon: '/icons/admin_analytics_act.png',
    href: '/admin/analytics',
  },
  {
    name: '댓글 관리',
    icon: '/icons/admin_management.png',
    activeIcon: '/icons/admin_management_act.png',
    href: '/admin/comment',
  },
  {
    name: '카테고리 관리',
    icon: '/icons/admin_management.png',
    activeIcon: '/icons/admin_management_act.png',
    href: '/admin/category',
  },
  {
    name: '블로그 관리',
    icon: '/icons/admin_blog.png',
    activeIcon: '/icons/admin_blog_act.png',
    href: '/admin/blog-settings',
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isDarkMode } = useTheme();
  const pathname = usePathname();

  const currentMenuItem =
    menuItems.find((item) => item.href === pathname) || menuItems[0];

  return (
    <div
      className={`flex h-[calc(100vh-90px)] ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-[#2B3674]'}`}
    >
      <div
        className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'} w-64 p-4`}
      >
        <h1 className="text-2xl font-bold mb-6">Admin</h1>
        <nav>
          <ul
            className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#A3AED0]'}`}
          >
            {menuItems.map((item) => (
              <li key={item.name} className="pt-2 pb-2">
                <Link href={item.href}>
                  <div
                    className={`flex ${
                      pathname === item.href
                        ? isDarkMode
                          ? 'text-white font-bold'
                          : 'text-[#2B3674] font-bold'
                        : isDarkMode
                          ? 'text-gray-400'
                          : 'text-[#A3AED0]'
                    } items-center `}
                  >
                    <div className="w-[26px] h-[26px] mr-3 flex items-center justify-center">
                      <Image
                        src={
                          isDarkMode
                            ? item.icon
                            : pathname === item.href
                              ? item.activeIcon
                              : item.icon
                        }
                        alt={item.name}
                        width={26}
                        height={26}
                      />
                    </div>
                    <div>{item.name}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="w-full mt-4">
        <Card
          className={cn(
            `h-auto ${isDarkMode ? 'bg-gray-800' : 'bg-[#F4F7FE]'}`,
          )}
        >
          <h1 className="text-2xl font-bold mb-4">{currentMenuItem.name}</h1>
          {children}
        </Card>
      </div>
    </div>
  );
}
