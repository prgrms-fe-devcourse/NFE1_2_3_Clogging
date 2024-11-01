import React from 'react';
import { useTheme } from '@/shared/providers/theme';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useCategories } from '../hooks'; // hooks.ts에서 가져오기

// Props 인터페이스 제거 (더 이상 필요하지 않음)

const CategorySection: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const { categories } = useCategories(); // useCategories hook 사용

  return (
    <div>
      <h2
        className={`mb-6 text-xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}
      >
        Category
      </h2>
      <ul className="space-y-4">
        <li>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`text-left transition-all ${
              selectedCategory === null
                ? 'text-primary border-b-2 border-primary'
                : `${
                    isDarkMode ? 'text-white' : 'text-gray-700'
                  } hover:text-primary hover:border-b-2 hover:border-primary`
            }`}
          >
            전체 ({categories.length})
          </button>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <button
              onClick={() => setSelectedCategory(category.id)}
              className={`text-left transition-all ${
                selectedCategory === category.id
                  ? 'text-primary border-b-2 border-primary'
                  : `${
                      isDarkMode ? 'text-white' : 'text-gray-700'
                    } hover:text-primary hover:border-b-2 hover:border-primary`
              }`}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySection;
