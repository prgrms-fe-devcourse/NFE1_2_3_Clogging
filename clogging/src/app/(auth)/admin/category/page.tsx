import { Suspense } from 'react';
import { CategoryManagement } from '@/features/Category/ui/admin/CategoryManagement';

export default function CategoriesPage() {
  return (
    <div className="my-8">
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryManagement />
      </Suspense>
    </div>
  );
}
