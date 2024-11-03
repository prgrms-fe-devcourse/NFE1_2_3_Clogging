import React, { useState } from 'react';
import { isCategoryNameValid } from '../../utils/categoryValidator';
import { useTheme } from '@/shared/providers/theme';
import Image from 'next/image';
import { useCategories } from '../../hooks'; // useCategories 훅을 임포트

interface CategoryFormProps {
  onSubmit: (name: string) => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ onSubmit }) => {
  const { isDarkMode } = useTheme();
  const { addCategory } = useCategories(); // 훅에서 addCategory 가져오기

  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isCategoryNameValid(categoryName)) {
      return alert('20자 이내의 유효한 이름을 입력해주세요.');
    }

    try {
      onSubmit(categoryName); // 카테고리 추가 후 부모 컴포넌트에 알림
      setCategoryName(''); // 입력 필드 초기화
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex items-center justify-between"
    >
      <input
        type="text"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        placeholder="새 카테고리 이름을 입력해주세요"
        className={`p-2 rounded-lg mr-4 flex-grow border-none focus:outline-none ${
          isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'
        }`}
      />
      <button type="submit" className="w-5">
        <Image
          width={24}
          height={24}
          src="/icons/admin_plus.png"
          alt="추가"
          className="w-5 h-auto"
        />
      </button>
      {error && <p className="text-red-500">{error}</p>}{' '}
      {/* 오류 메시지 표시 */}
    </form>
  );
};
