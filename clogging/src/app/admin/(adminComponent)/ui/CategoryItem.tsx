'use client';
import React, { useState, ChangeEvent } from 'react';
import { Category } from '../types';
import { isCategoryNameValid } from '../utils/categoryValidator';
import { useTheme } from '@/contexts/ThemeContext'; // ThemeContext를 가져옵니다.

interface CategoryItemProps {
  category: Category;
  onEdit: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  onEdit,
  onDelete,
}) => {
  const { isDarkMode } = useTheme(); // 다크 모드 여부를 가져옵니다.
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(category.name);

  const handleItemClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      setEditingName(category.name);
    }
  };

  const handleEditSubmit = () => {
    if (isCategoryNameValid(editingName)) {
      onEdit(category.id, editingName);
      setIsEditing(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditingName(category.name); // 원래 이름으로 되돌리기
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditingName(e.target.value);
  };

  return (
    <li className={`flex items-center justify-between`}>
      <div className="flex-grow" onClick={handleItemClick}>
        {isEditing ? (
          <input
            type="text"
            value={editingName}
            onChange={handleInputChange}
            className={`p-1 rounded-lg w-full border-none focus:outline-none ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-[#EFF8FF] text-black'}`}
            autoFocus
          />
        ) : (
          <div
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-[#EFF8FF] text-black'}`}
          >
            {category.name}
          </div>
        )}
      </div>
      <div className="flex items-center ml-4">
        {isEditing ? (
          <>
            <button
              onClick={handleEditSubmit}
              className="p-1 bg-gray-200 text-black rounded mr-1" // 연한 회색으로 변경
            >
              저장
            </button>
            <button
              onClick={handleEditCancel}
              className="p-1 bg-gray-200 text-black rounded mr-1" // 연한 회색으로 변경
            >
              취소
            </button>
          </>
        ) : (
          <button onClick={() => onDelete(category.id)} className="">
            <img
              src="/icons/admin_minus.png"
              alt="삭제"
              className="w-5 h-auto"
            />
          </button>
        )}
      </div>
    </li>
  );
};
