// src/features/Category/ui/CategoryManagement/CategoryManagement.tsx

'use client';

import React, { useEffect, useState } from 'react';

export const CategoryManagement: React.FC = () => {
  const {
    categories,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  } = useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddOrUpdate = (name: string) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, name);
      setEditingCategory(null);
    } else {
      addCategory(name);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleReorder = (id: string, direction: 'up' | 'down') => {
    const index = categories.findIndex((cat) => cat.id === id);
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < categories.length) {
      reorderCategories(id, newIndex);
    }
  };

  return (
    <>
      <CategoryForm
        onSubmit={handleAddOrUpdate}
        initialValue={editingCategory?.name}
      />
      <CategoryList
        categories={categories}
        onEdit={handleEdit}
        onDelete={deleteCategory}
        onReorder={handleReorder}
      />
    </>
  );
};
