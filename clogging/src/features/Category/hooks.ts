import { useState, useCallback } from 'react';
import { Category } from './types';
import { sortCategoriesByOrder } from './utils/categorySort';
import { isCategoryNameValid } from './utils/categoryValidator';

export const useCategories = (initialCategories: Category[] = []) => {
  const [categories, setCategories] = useState<Category[]>(
    sortCategoriesByOrder(initialCategories),
  );

  const fetchCategories = useCallback((fetchedCategories: Category[]) => {
    setCategories(sortCategoriesByOrder(fetchedCategories));
  }, []);

  const addCategory = useCallback(async (name: string) => {
    if (!isCategoryNameValid(name)) {
      throw new Error('20자 이내로 유효한 이름을 입력해주세요.');
    }

    // API 호출하여 카테고리 추가
    const response = await fetch('/api/categories/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || '카테고리 추가 실패');
    }

    const data = await response.json();
    setCategories((prev) => sortCategoriesByOrder([...prev, data.category]));
  }, []);

  const updateCategory = useCallback((id: string, name: string) => {
    if (!isCategoryNameValid(name)) {
      throw new Error('Invalid category name');
    }
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, name } : cat)),
    );
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/categories/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '카테고리 삭제 실패');
      }

      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const reorderCategories = useCallback((id: string, newOrder: number) => {
    setCategories((prev) => {
      const category = prev.find((cat) => cat.id === id);
      if (!category) return prev;

      const newCategories = prev.filter((cat) => cat.id !== id);
      newCategories.splice(newOrder, 0, category);
      return sortCategoriesByOrder(
        newCategories.map((cat, index) => ({ ...cat, order: index })),
      );
    });
  }, []);

  const getCategoryName = useCallback(
    (categoryId: string): string => {
      return (
        categories.find((category: Category) => category.id === categoryId)
          ?.name ?? ''
      );
    },
    [categories],
  );

  return {
    categories,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    getCategoryName,
  };
};
