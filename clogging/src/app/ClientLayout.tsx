'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import Link from 'next/link';
import { Navigation } from '@/shared/ui/layout/Navigation';
import { QueryProviders } from './queryProviders';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAdminSetup = async () => {
      try {
        const adminDoc = await getDoc(doc(db, 'admin', 'credentials'));
        if (!adminDoc.exists() && pathname !== '/admin/init') {
          confirm('비밀번호 초기 설정이 필요합니다.');
          router.push('/admin/init');
        }
      } catch (error) {
        console.error('관리자 설정 확인 실패:', error);
      } finally {
        setChecking(false);
      }
    };
    checkAdminSetup();
  }, [pathname, router]);

  if (checking) {
    return <div>로딩 중...</div>;
  }

  return (
    <QueryProviders>
      <Navigation />
      <main className="container">{children}</main>
    </QueryProviders>
  );
}
