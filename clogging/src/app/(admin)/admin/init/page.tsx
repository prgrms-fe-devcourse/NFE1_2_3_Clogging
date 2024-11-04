'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/common/Button';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export default function AdminInitPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const router = useRouter();

  // 관리자 설정 존재 여부 확인
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const adminDoc = await getDoc(doc(db, 'admin', 'credentials'));
        setIsInitialized(adminDoc.exists());
      } catch (error) {
        console.error('관리자 상태 확인 에러:', error);
        setError('관리자 상태 확인에 실패했습니다.');
      }
    };

    checkAdminStatus();
  }, []);

  const handleInitOrReset = async () => {
    if (isInitialized && !confirm('관리자 설정을 초기화하시겠습니까?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isInitialized) {
        // 기존 설정이 있는 경우 리셋 먼저 실행
        const resetResponse = await fetch('/api/admin/reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!resetResponse.ok) {
          const resetData = await resetResponse.json();
          throw new Error(resetData.error || '초기화에 실패했습니다.');
        }
      }

      // 초기 설정 실행
      const initResponse = await fetch('/api/admin/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const initData = await initResponse.json();

      if (!initResponse.ok) {
        throw new Error(initData.error || '설정에 실패했습니다.');
      }

      alert(`관리자 비밀번호가 설정되었습니다: ${initData.initialPassword}`);
      router.push('/home');
    } catch (error) {
      setError(error instanceof Error ? error.message : '작업에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (isInitialized === null) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          관리자 {isInitialized ? '초기화' : '초기 설정'}
        </h1>
        <div className="space-y-4">
          <p className="text-gray-600">
            {isInitialized
              ? '기존 관리자 설정을 초기화하고 새로 설정합니다.'
              : '관리자 계정의 초기 비밀번호를 설정합니다.'}
          </p>
          {error && (
            <p className="text-red-500 text-sm p-2 bg-red-50 rounded">
              {error}
            </p>
          )}
          <Button
            onClick={handleInitOrReset}
            disabled={loading}
            variant={isInitialized ? 'secondary' : 'primary'}
            className="w-full"
          >
            {loading
              ? '처리 중...'
              : isInitialized
                ? '관리자 설정 초기화'
                : '관리자 초기 설정'}
          </Button>
          <p className="text-sm text-gray-500">
            * 초기 비밀번호는 보안을 위해 즉시 변경하시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
}
