'use client';

import { Button } from '@/shared/ui/common/Button';
import { Input } from '@/shared/ui/common/Input';
import { useState } from 'react';
import { useAdminStore } from '../stores/useAdminStore';
import { useRouter } from 'next/navigation';

export const AdminAuth = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAdmin = useAdminStore((state) => state.setAdmin);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setAdmin(true);
      localStorage.setItem('userRole', 'admin');
      alert('관리자 인증이 완료되었습니다.');
      router.push('/home');
    } catch (error) {
      setError(error instanceof Error ? error.message : '인증에 실패했습니다.');
      setAdmin(false);
      localStorage.removeItem('userRole');
    } finally {
      setLoading(false);
      setPassword('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="관리자 비밀번호를 입력하세요"
          className="w-full"
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? '인증 중...' : '관리자 인증'}
      </Button>
    </form>
  );
};
