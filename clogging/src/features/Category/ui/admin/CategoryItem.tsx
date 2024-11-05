import React, { useState, ChangeEvent } from 'react';
import { Category } from '../../types';
import { isCategoryNameValid } from '../../utils/categoryValidator';
import { useTheme } from '@/shared/providers/theme';
import Image from 'next/image';

interface CategoryItemProps {
  category: Category;
  handleUpdateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  isEditing: boolean; // 현재 수정 중인지 여부
  onEditClick: (id: string) => void; // 수정 버튼 클릭 핸들러
  onCancelEdit: () => void; // 수정 취소 핸들러
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  handleUpdateCategory,
  deleteCategory,
  isEditing,
  onEditClick,
  onCancelEdit,
}) => {
  const { isDarkMode } = useTheme();
  const [editingName, setEditingName] = useState(category.name);

  const handleEditSubmit = () => {
    if (isCategoryNameValid(editingName)) {
      handleUpdateCategory(category.id, editingName);
      onCancelEdit();
    }
  };

  const handleCancelEdit = () => {
    setEditingName(category.name);
    onCancelEdit();
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
      <div
        className="flex-grow"
        onClick={() => !isEditing && onEditClick(category.id)}
      >
        {isEditing ? (
          <input
            type="text"
            value={editingName}
            onChange={handleInputChange}
            className={`p-1 rounded-lg w-full border-none focus:outline-none ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-[#EFF8FF] text-black'}`}
            autoFocus
            onBlur={handleCancelEdit} // 입력 필드가 포커스를 잃었을 때 취소
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
              onClick={handleCancelEdit}
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
