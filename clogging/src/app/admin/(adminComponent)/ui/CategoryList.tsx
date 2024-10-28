// src/features/Category/ui/CategoryList/CategoryList.tsx

import React from 'react';
import { Category } from '../types';
import { CategoryItem } from './CategoryItem';

interface CategoryListProps {
  categories: Category[];
  onEdit: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onEdit,
  onDelete,
}) => {
  return (
    <ul className="space-y-2">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};
