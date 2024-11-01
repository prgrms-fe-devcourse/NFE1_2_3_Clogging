'use client';
import React, { useEffect } from 'react';
import { useCategories } from '../../hooks';
import { CategoryForm } from './CategoryForm';
import { CategoryList } from './CategoryList';
import { CategoryOrderList } from './CategoryOrderList';
import { useTheme } from '@/shared/providers/theme';
import { Category } from '../../types';

interface CategoryManagementProps {
  initialCategories: Array<Category>;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({
  initialCategories,
}) => {
  const {
    categories,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  } = useCategories(initialCategories);

  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (initialCategories.length === 0) {
      fetchCategories();
    }
  }, [fetchCategories, initialCategories]);

  const handleAddCategory = (name: string) => {
    addCategory(name);
  };

  const handleUpdateCategory = (id: string, name: string) => {
    updateCategory(id, name);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newCategories = [...categories];
    const [movedItem] = newCategories.splice(fromIndex, 1);
    newCategories.splice(toIndex, 0, movedItem);

    newCategories.forEach((category, index) => {
      reorderCategories(category.id, index);
    });
  };

  return (
    <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
      <div
        className={`flex-1 rounded-lg shadow-sm p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
      >
        <CategoryForm onSubmit={handleAddCategory} />
        <CategoryList
          categories={categories}
          handleUpdateCategory={handleUpdateCategory}
          deleteCategory={deleteCategory}
        />
      </div>
      <div
        className={`flex-1 rounded-lg shadow-sm p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
      >
        <h3 className="mb-4 text-b font-bold">순서 변경</h3>
        <CategoryOrderList categories={categories} onReorder={handleReorder} />
      </div>
    </div>
  );
};
