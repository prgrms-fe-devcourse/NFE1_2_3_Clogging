'use client';

import { Button } from '@/shared/ui/common/Button';
import { Dialog } from '@/shared/ui/common/Dialog';
import { Input } from '@/shared/ui/common/Input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../hooks';

export function AdminAuthDialog({ isOpen, onClose }: Props) {
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { verifyAdmin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await verifyAdmin(password);
    if (isValid) {
      onClose();
      router.push('/home');
    } else {
      alert('잘못된 비밀번호입니다.');
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="관리자 인증">
      <form onSubmit={handleSubmit}>
        <div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="관리자 비밀번호를 입력하세요"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded w-full"
          >
            취소
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded w-full"
          >
            확인
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
