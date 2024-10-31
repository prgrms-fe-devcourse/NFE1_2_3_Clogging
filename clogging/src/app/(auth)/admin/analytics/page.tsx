import BlogAnalytics from '@/features/Admin/Analytics/ui/BlogAnalytics';
import { fetchBlogData } from '@/features/Admin/Analytics/utils/fetchBlogData';

export default async function Page() {
  const blogData = await fetchBlogData();

  return (
    <div>
      <BlogAnalytics data={blogData} />
    </div>
  );
}
