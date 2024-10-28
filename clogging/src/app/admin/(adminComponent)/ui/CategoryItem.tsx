import React from 'react';
import { Button } from '@/components/ui/common/Button';
import { Category } from '../../../../shared/types/types';

interface CategoryItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  onEdit,
  onDelete,
  onReorder,
}) => {
  return (
    <li className="flex items-center justify-between mb-2 p-2 bg-gray-100 rounded">
      <span>{category.name}</span>
      <div>
        <Button onClick={() => onReorder(category.id, 'up')} className="mr-1">
          ↑
        </Button>
        <Button onClick={() => onReorder(category.id, 'down')} className="mr-1">
          ↓
        </Button>
        <Button onClick={() => onEdit(category)} className="mr-1">
          수정
        </Button>
        <Button onClick={() => onDelete(category.id)}>삭제</Button>
      </div>
    </li>
  );
};
