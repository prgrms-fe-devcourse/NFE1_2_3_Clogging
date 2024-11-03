import { Suspense } from 'react';
import { CategoryManagement } from '@/features/Category/ui/admin/CategoryManagement';

export default function CategoriesPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryManagement />
      </Suspense>
    </div>
  );
}
