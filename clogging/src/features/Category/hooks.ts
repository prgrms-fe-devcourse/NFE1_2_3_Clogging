import { useState, useCallback } from 'react';
import { Category } from './types';
import { sortCategoriesByOrder } from './utils/categorySort';
import { isCategoryNameValid } from './utils/categoryValidator';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export const useCategories = (initialCategories: Category[] = []) => {
  const [categories, setCategories] = useState<Category[]>(
    sortCategoriesByOrder(initialCategories),
  );

  const fetchCategories = useCallback(async () => {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);

    const fetchedCategories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];

    setCategories(sortCategoriesByOrder(fetchedCategories));
  }, []);

  const addCategory = useCallback(
    async (name: string) => {
      if (!isCategoryNameValid(name)) {
        throw new Error('20자 이내로 유효한 이름을 입력해주세요.');
      }

      try {
        const categoriesRef = collection(db, 'categories');
        const order = categories.length; // 새 카테고리는 마지막에 추가

        const newCategoryData = {
          name,
          order,
          postCount: 0, // 초기값 0
          postIds: [], // 초기값 빈 배열
        };

        const docRef = await addDoc(categoriesRef, newCategoryData);

        const newCategory: Category = {
          id: docRef.id,
          ...newCategoryData,
        };

        setCategories((prev) => sortCategoriesByOrder([...prev, newCategory]));
      } catch (error) {
        console.error('카테고리 추가 실패:', error);
        throw new Error('카테고리 추가 실패');
      }
    },
    [categories],
  );

  const updateCategory = useCallback(async (id: string, name: string) => {
    if (!isCategoryNameValid(name)) {
      throw new Error('Invalid category name');
    }

    try {
      const categoryRef = doc(db, 'categories', id);
      await updateDoc(categoryRef, { name });

      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, name } : cat)),
      );
    } catch (error) {
      console.error('카테고리 수정 실패:', error);
      throw new Error('카테고리 수정 실패');
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      const categoryRef = doc(db, 'categories', id);
      await deleteDoc(categoryRef);

      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error('카테고리 삭제 실패:', error);
      throw new Error('카테고리 삭제 실패');
    }
  }, []);

  const reorderCategories = useCallback(
    async (fromIndex: number, toIndex: number) => {
      try {
        const batch = writeBatch(db);
        const newCategories = [...categories];
        const [movedCategory] = newCategories.splice(fromIndex, 1);
        newCategories.splice(toIndex, 0, movedCategory);

        // 새로운 order 값을 설정하고 batch 업데이트 준비
        newCategories.forEach((category, index) => {
          category.order = index;
          const categoryRef = doc(db, 'categories', category.id);
          batch.update(categoryRef, { order: index });
        });

        // batch 커밋
        await batch.commit();

        setCategories(sortCategoriesByOrder(newCategories));
      } catch (error) {
        console.error('카테고리 순서 변경 실패:', error);
        throw new Error('카테고리 순서 변경 실패');
      }
    },
    [categories],
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
