import { useState, useCallback } from 'react';
import { Category } from '../../../../shared/types/types';
// import { categoryService } from '@/shared/api/services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = useCallback(async () => {
    const data = await categoryService.getCategories();
    setCategories(data);
  }, []);

  return { categories, fetchCategories };
};
