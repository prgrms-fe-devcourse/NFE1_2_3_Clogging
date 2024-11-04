import React, { useState, ChangeEvent } from 'react';
import { Category } from '../../types';
import { isCategoryNameValid } from '../../utils/categoryValidator';
import { useTheme } from '@/shared/providers/theme';
import Image from 'next/image';

interface CategoryItemProps {
  category: Category;
  handleUpdateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  handleUpdateCategory,
  deleteCategory,
}) => {
  const { isDarkMode } = useTheme();
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
      handleUpdateCategory(category.id, editingName);
      setIsEditing(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditingName(category.name);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditingName(e.target.value);
  };

  const handleDeleteClick = () => {
    // 삭제 확인
    const confirmed = confirm('정말 삭제하시겠습니까?');
    if (confirmed) {
      deleteCategory(category.id);
    }
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
              className="p-1 bg-gray-200 text-black rounded mr-1"
            >
              저장
            </button>
            <button
              onClick={handleEditCancel}
              className="p-1 bg-gray-200 text-black rounded mr-1"
            >
              취소
            </button>
          </>
        ) : (
          <button onClick={handleDeleteClick} className="">
            <Image
              width={24}
              height={24}
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
