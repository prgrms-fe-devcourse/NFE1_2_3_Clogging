import React, { useState } from 'react';
import { isCategoryNameValid } from '../utils/categoryValidator';
import { useTheme } from '@/contexts/ThemeContext'; // ThemeContext를 가져옵니다.

interface CategoryFormProps {
  onSubmit: (name: string) => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ onSubmit }) => {
  const { isDarkMode } = useTheme(); // 다크 모드 여부를 가져옵니다.
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCategoryNameValid(name)) {
      onSubmit(name);
      setName('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex items-center justify-between"
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="새 카테고리 이름을 입력해주세요"
        className={`p-2 rounded-lg mr-4 flex-grow border-none focus:outline-none ${
          isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'
        }`}
      />
      <button type="submit" className="w-5">
        <img src="/icons/admin_plus.png" alt="추가" className="w-5 h-auto" />
      </button>
    </form>
  );
};
