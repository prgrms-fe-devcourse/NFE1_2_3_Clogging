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

  const reorderCategories = useCallback(
    async (fromIndex: number, toIndex: number) => {
      setCategories((prev) => {
        const newCategories = [...prev];
        const [movedCategory] = newCategories.splice(fromIndex, 1);
        newCategories.splice(toIndex, 0, movedCategory);

        // 새로운 order 값을 설정
        newCategories.forEach((category, index) => {
          category.order = index; // 새로운 순서에 따라 order 업데이트
        });

        // 서버에 카테고리 순서 변경 요청
        fetch('/api/categories/reorder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            newCategories.map((cat) => ({ id: cat.id, order: cat.order })),
          ),
        });

        return sortCategoriesByOrder(newCategories); // 정렬된 상태 반환
      });
    },
    [],
  );

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
