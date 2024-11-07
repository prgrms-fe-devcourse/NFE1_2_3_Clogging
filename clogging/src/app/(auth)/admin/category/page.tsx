import { Suspense } from 'react';
import { CategoryManagement } from '@/features/Category/ui/admin/CategoryManagement';

export default function CategoriesPage() {
  return (
    <div className="my-8">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary"></div>
          </div>
        }
      >
        <CategoryManagement />
      </Suspense>
    </div>
  );
}
