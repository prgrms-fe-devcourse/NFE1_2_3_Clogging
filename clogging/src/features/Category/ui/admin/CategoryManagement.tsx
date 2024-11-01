'use client';
import React, { useEffect, useState } from 'react';
import { useCategories } from '../../hooks';
import { CategoryForm } from './CategoryForm';
import { CategoryList } from './CategoryList';
import { CategoryOrderList } from './CategoryOrderList';
import { useTheme } from '@/shared/providers/theme';
import { Category } from '../../types';

export const CategoryManagement: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    categories,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  } = useCategories();

  const { isDarkMode } = useTheme();

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      await fetchCategories();
      setIsLoading(false);
    };
    loadCategories();
  }, [fetchCategories]);

  const handleAddCategory = async (name: string) => {
    try {
      await addCategory(name);
      await fetchCategories(); // 카테고리 추가 후 목록 새로고침
    } catch (error) {
      console.error('카테고리 추가 실패:', error);
    }
  };

  const handleUpdateCategory = async (id: string, name: string) => {
    try {
      await updateCategory(id, name);
      await fetchCategories(); // 카테고리 업데이트 후 목록 새로고침
    } catch (error) {
      console.error('카테고리 업데이트 실패:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      await fetchCategories(); // 카테고리 삭제 후 목록 새로고침
    } catch (error) {
      console.error('카테고리 삭제 실패:', error);
    }
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    try {
      await reorderCategories(fromIndex, toIndex);
      await fetchCategories(); // 카테고리 순서 변경 후 목록 새로고침
    } catch (error) {
      console.error('카테고리 순서 변경 실패:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
      <div
        className={`flex-1 rounded-lg shadow-sm p-4 ${
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        }`}
      >
        <CategoryForm onSubmit={handleAddCategory} />
        <CategoryList
          categories={categories}
          handleUpdateCategory={handleUpdateCategory}
          deleteCategory={handleDeleteCategory}
        />
      </div>
      <div
        className={`flex-1 rounded-lg shadow-sm p-4 ${
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        }`}
      >
        <h3 className="mb-4 text-b font-bold">순서 변경</h3>
        <CategoryOrderList categories={categories} onReorder={handleReorder} />
      </div>
    </div>
  );
};
