'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/common/Button';
import { Input } from '@/shared/ui/common/Input';
import { updateAdminPassword } from '@/features/Admin/api/adminApi';

export const SettingPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 4) {
      setError('비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      await updateAdminPassword(newPassword);
      alert('관리자 비밀번호가 변경되었습니다.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6">비밀번호 변경</h1>
      <div className="w-full">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              새 비밀번호
            </label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호를 입력하세요"
              className="w-full"
              required
              minLength={4}
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              비밀번호 확인
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              className="w-full"
              required
              minLength={4}
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm p-2 bg-red-50 rounded">
              {error}
            </p>
          )}
          <Button
            onClick={handlePasswordChange}
            className="w-full"
            disabled={loading}
          >
            {loading ? '변경 중...' : '비밀번호 변경'}
          </Button>
        </div>
      </div>
    </div>
  );
};
