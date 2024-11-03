// CategoryOrderList.tsx
import React, { useState } from 'react';
import { Category } from '../../types';
import { useTheme } from '@/shared/providers/theme';
import Image from 'next/image';

interface CategoryOrderListProps {
  categories: Category[];
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export const CategoryOrderList: React.FC<CategoryOrderListProps> = ({
  categories,
  onReorder,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { isDarkMode } = useTheme();

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      onReorder(draggedIndex, targetIndex); // reorderCategories 함수 호출
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null); // 드래그가 끝날 때 draggedIndex를 null로 설정
  };

  return (
    <ul className="space-y-2">
      {categories.map((category, index) => (
        <li
          key={category.id}
          className={`flex items-center justify-between p-2 rounded-lg cursor-move transition-all duration-200  ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#EFF8FF] text-black'} ${
            draggedIndex !== null && draggedIndex !== index
              ? isDarkMode
                ? 'bg-gray-700'
                : 'bg-blue-50'
              : isDarkMode
                ? 'bg-gray-800'
                : 'bg-blue-100'
          }`}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(index)}
          onDragEnd={handleDragEnd} // 드래그가 끝날 때 호출되는 핸들러 추가
        >
          <span className={isDarkMode ? 'text-white' : 'text-black'}>
            {category.name}
          </span>
          <div>
            <Image
              width={24}
              height={24}
              src="/icons/admin_handle.png"
              alt="핸들"
              className="w-4 h-auto"
            />
          </div>
        </li>
      ))}
    </ul>
  );
};
