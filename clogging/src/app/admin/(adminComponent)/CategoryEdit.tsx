'use client';
import React, { useState } from 'react';

export default function CategoryEdit() {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4">
      <form onSubmit={handleAddCategory} className="mb-4">
        <div className="flex items-center">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="추가할 카테고리를 입력해주세요."
            className="flex-grow p-2 border rounded-l"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-r"
          >
            +
          </button>
        </div>
      </form>
      <div>
        <h2 className="text-xl font-bold mb-2">카테고리 목록</h2>
        {categories.map((category, index) => (
          <div key={index} className="flex items-center justify-between mb-2">
            <span>{category}</span>
            <button
              onClick={() => handleDeleteCategory(index)}
              className="bg-red-500 text-white p-1 rounded"
            >
              -
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
