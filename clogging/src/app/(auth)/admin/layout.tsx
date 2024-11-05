'use client';
import { ReactNode, useEffect } from 'react';
import { useTheme } from '@/shared/providers/theme';
import { useAuth } from '@/features/Admin/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/features/Admin/ui/SideBar';
import { MainContent } from '@/features/Admin/ui/MainContent';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isDarkMode } = useTheme();
  const { isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return <div>접근 권한이 없습니다.</div>;
  }

  return (
    <div
      className={`flex flex-col lg:flex-row min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-[#2B3674]'}`}
    >
      <Sidebar />
      <MainContent>{children}</MainContent>
    </div>
  );
}
