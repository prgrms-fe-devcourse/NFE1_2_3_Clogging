import { Suspense } from 'react';
import { CategoryManagement } from '@/features/Category/ui/admin/CategoryManagement';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { Category } from '@/features/Category/types';

async function fetchCategories(): Promise<Category[]> {
  const categoriesRef = collection(db, 'categories');
  const categorySnapshot = await getDocs(categoriesRef);

  if (categorySnapshot.empty) {
    return []; // 카테고리가 없으면 빈 배열 반환
  }

  const categories = categorySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];

  return categories;
}

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryManagement initialCategories={categories} />
      </Suspense>
    </div>
  );
}
