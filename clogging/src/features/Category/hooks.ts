// hooks.ts
import { useState, useCallback } from 'react';
import { Category } from './types';
import { sortCategoriesByOrder } from './utils/categorySort';
import { isCategoryNameValid } from './utils/categoryValidator';

export const useCategories = (initialCategories: Category[] = []) => {
  const [categories, setCategories] = useState<Category[]>(
    sortCategoriesByOrder(initialCategories),
  );
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('카테고리 목록을 가져오는데 실패했습니다.');
      }
      const data = await response.json();
      setCategories(sortCategoriesByOrder(data.categories));
    } catch (error) {
      console.error('카테고리 목록 가져오기 실패:', error);
    }
  }, []);

  const addCategory = useCallback(
    async (name: string) => {
      if (!isCategoryNameValid(name)) {
        throw new Error('20자 이내로 유효한 이름을 입력해주세요.');
      }

      try {
        const response = await fetch('/api/categories/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 409) {
            alert('이미 존재하는 카테고리 이름입니다.' || data.error);
            return;
          }
          throw new Error(data.error || '카테고리 추가 실패');
        }

        // 카테고리 추가 후 최신 목록 가져오기
        await fetchCategories();

        return data.category;
      } catch (error) {
        console.error('카테고리 추가 중 오류:', error);
        throw error;
      }
    },
    [fetchCategories],
  );

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
      const newCategories = [...categories];
      const [movedCategory] = newCategories.splice(fromIndex, 1);
      newCategories.splice(toIndex, 0, movedCategory);

      // 새로운 order 값을 설정
      const updatedCategories = newCategories.map((category, index) => ({
        ...category,
        order: index,
      }));

      // 서버에 카테고리 순서 변경 요청
      try {
        const response = await fetch('/api/categories/reorder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            updatedCategories.map((cat) => ({ id: cat.id, order: cat.order })),
          ),
        });

        if (!response.ok) {
          throw new Error('카테고리 순서 업데이트 실패');
        }

        // 서버 응답이 성공적이면 클라이언트 상태 업데이트
        setCategories(sortCategoriesByOrder(updatedCategories));
      } catch (error) {
        console.error('카테고리 순서 변경 중 오류 발생:', error);
        // 오류 발생 시 원래 상태로 되돌리기
        setCategories(sortCategoriesByOrder(categories));
      }
    },
    [categories],
  );

  const getCategoryName = useCallback(
    (categoryId: string): string => {
      return (
        categories.find((category) => category.id === categoryId)?.name ?? ''
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
