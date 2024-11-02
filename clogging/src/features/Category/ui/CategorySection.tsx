import React, { useEffect, useMemo } from 'react'; // useMemo 추가
import { useTheme } from '@/shared/providers/theme';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useCategories } from '../hooks';

const CategorySection: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const { categories, fetchCategories } = useCategories();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 모든 카테고리의 postCount 합계 계산
  const totalPosts = useMemo(() => {
    return categories.reduce((total, category) => {
      return total + (category.postCount || 0);
    }, 0);
  }, [categories]);

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
            전체 ({totalPosts}) {/* categories.length 대신 totalPosts 사용 */}
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
              {category.name} ({category.postCount || 0})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySection;
