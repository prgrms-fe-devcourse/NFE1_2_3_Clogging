'use client';

import { Button } from '@/shared/ui/common/Button';
import { AdminAuthDialog } from './AdminAuthDialog';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks';
import { useState } from 'react';

export function IntroButtons() {
  const router = useRouter();
  const { setAsUser } = useAuth(); // useAuth에서 setAsUser 가져오기
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);

  const handleUserClick = () => {
    setAsUser(); // 일반 사용자로 설정
    router.push('/home');
  };

  return (
    <div className="flex gap-4 justify-center">
      <Button
        variant="outline"
        onClick={handleUserClick} // 수정된 핸들러
      >
        일반 사용자로 시작하기
      </Button>
      <Button onClick={() => setIsAdminDialogOpen(true)}>
        관리자로 시작하기
      </Button>
      <AdminAuthDialog
        isOpen={isAdminDialogOpen}
        onClose={() => setIsAdminDialogOpen(false)}
      />
    </div>
  );
}
