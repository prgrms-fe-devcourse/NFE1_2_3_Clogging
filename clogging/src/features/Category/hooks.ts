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

  const addCategory = useCallback(
    (name: string) => {
      if (!isCategoryNameValid(name)) {
        throw new Error('Invalid category name');
      }
      const newCategory: Category = {
        id: String(Date.now()),
        name,
        order: categories.length,
        postCount: 0,
        postIds: [],
      };
      setCategories((prev) => sortCategoriesByOrder([...prev, newCategory]));
    },
    [categories],
  );

  const updateCategory = useCallback((id: string, name: string) => {
    if (!isCategoryNameValid(name)) {
      throw new Error('Invalid category name');
    }
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, name } : cat)),
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
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
