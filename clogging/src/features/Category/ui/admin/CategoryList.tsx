import React, { useState } from 'react';
import { Category } from '../../types';
import { CategoryItem } from './CategoryItem';

interface CategoryListProps {
  categories: Category[];
  handleUpdateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
}

export const CategoryList = ({
  categories,
  handleUpdateCategory,
  deleteCategory,
}: CategoryListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null); // 현재 수정 중인 카테고리 ID

  const handleEditClick = (id: string) => {
    setEditingId(id); // 클릭한 카테고리 ID로 수정 모드
  };

  const handleCancelEdit = () => {
    setEditingId(null); // 수정 취소 시 ID 초기화
  };

  return (
    <ul className="space-y-2">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          handleUpdateCategory={handleUpdateCategory}
          deleteCategory={deleteCategory}
          isEditing={editingId === category.id} // 현재 수정 중인지 여부 전달
          onEditClick={handleEditClick} // 클릭 시 수정 모드로 전환하는 함수 전달
          onCancelEdit={handleCancelEdit} // 수정 취소 함수 전달
        />
      ))}
    </ul>
  );
};
