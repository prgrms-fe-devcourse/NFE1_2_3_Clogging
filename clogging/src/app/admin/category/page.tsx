import { Suspense } from 'react';
import { CategoryManagement } from '../(adminComponent)/ui/CategoryManagement';

export default async function CategoriesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">카테고리 관리</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryManagement />
      </Suspense>
    </div>
  );
}
