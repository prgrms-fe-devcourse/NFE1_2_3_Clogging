import React, { useState } from 'react';
import { isCategoryNameValid } from '../../utils/categoryValidator';
import { useTheme } from '@/shared/providers/theme';
import Image from 'next/image';

interface CategoryFormProps {
  onSubmit: (name: string) => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ onSubmit }) => {
  const { isDarkMode } = useTheme();

  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/categories/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '카테고리 추가 실패');
      }

      const data = await response.json();
      alert('카테고리 추가 되었습니다.');
      onSubmit(data.category.name); // 카테고리 추가 후 부모 컴포넌트에 알림
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
    </form>
  );
};
