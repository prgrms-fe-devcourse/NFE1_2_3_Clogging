import React from 'react';
import { Category } from '../../types';
import { CategoryItem } from './CategoryItem';

interface CategoryListProps {
  categories: Category[];
  handleUpdateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
}
export const CategoryList = ({
  categories,
  handleUpdateCategory,
  deleteCategory,
}: CategoryListProps) => {
  return (
    <ul className="space-y-2">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          handleUpdateCategory={handleUpdateCategory}
          deleteCategory={deleteCategory}
        />
      ))}
    </ul>
  );
};
