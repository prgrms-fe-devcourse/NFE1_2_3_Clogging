import { useState, useCallback } from 'react';
import { Category } from './types';
import { mockCategories } from '@/mocks/data/categories';
import { sortCategoriesByOrder } from './utils/categorySort';
import { isCategoryNameValid } from './utils/categoryValidator';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  const fetchCategories = useCallback(() => {
    setCategories(sortCategoriesByOrder(mockCategories));
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

  return {
    categories,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  };
};
