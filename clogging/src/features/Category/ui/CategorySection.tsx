import React, { useEffect } from 'react';
import { useTheme } from '@/shared/providers/theme';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useCategories } from '../hooks';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useQuery } from '@tanstack/react-query';

const CategorySection: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const { categories, fetchCategories } = useCategories();

  // 실제 포스트 수를 가져오는 쿼리
  const { data: postsData } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const postsRef = collection(db, 'posts');
      const snapshot = await getDocs(postsRef);
      const categoryCounts: Record<string, number> = { total: 0 };

      snapshot.docs.forEach((doc) => {
        const post = doc.data();
        categoryCounts.total += 1;

        if (post.category) {
          categoryCounts[post.category] =
            (categoryCounts[post.category] || 0) + 1;
        }
      });

      return categoryCounts;
    },
    staleTime: 1000 * 60, // 1분
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
            전체 ({postsData?.total || 0})
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
              {category.name} ({postsData?.[category.id] || 0})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySection;
