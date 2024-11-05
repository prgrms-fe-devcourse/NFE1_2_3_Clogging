// Page.tsx

import { getBlogData } from '@/features/Admin/Analytics/utils/getBlogData';
import BlogAnalytics from '@/features/Admin/Analytics/ui/BlogAnalytics';

export default async function Page() {
  try {
    const data = await getBlogData();

    return (
      <div>
        <BlogAnalytics data={data} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return (
      <div className="p-6 text-red-500">Error loading blog statistics</div>
    );
  }
}
