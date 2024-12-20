'use client';
import React, { useEffect, useState } from 'react';
import { useCategories } from '../../hooks';
import { CategoryForm } from './CategoryForm';
import { CategoryList } from './CategoryList';
import { CategoryOrderList } from './CategoryOrderList';
import { useTheme } from '@/shared/providers/theme';

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
    // 입력된 카테고리 이름에서 띄어쓰기 제거 및 소문자로 변환
    const inputName = name.replace(/\s+/g, '').toLowerCase();

    // 카테고리 목록에서 띄어쓰기 무시하고 중복 확인
    if (
      categories.some(
        (category) => category.name.replace(/\s+/g, '') === inputName,
      )
    ) {
      alert('이미 존재하는 카테고리 이름입니다. 다른 이름을 입력해주세요.');
      return;
    }
    try {
      await addCategory(name);
      await fetchCategories(); // 추가 후 목록 새로고침
    } catch (error) {
      console.error('카테고리 추가 실패:', error);
    }
  };

  const handleUpdateCategory = async (id: string, name: string) => {
    try {
      await updateCategory(id, name);
      await fetchCategories();
    } catch (error) {
      console.error('카테고리 업데이트 실패:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      await fetchCategories(); // 삭제 후 목록 새로고침
    } catch (error) {
      console.error('카테고리 삭제 실패:', error);
    }
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    try {
      await reorderCategories(fromIndex, toIndex);
      await fetchCategories(); // 순서 변경 후 목록 새로고침
    } catch (error) {
      console.error('카테고리 순서 변경 실패:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary"></div>
      </div>
    );
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
