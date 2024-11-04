// 관리자 전용 페이지들

import { Metadata } from 'next';
import BlogDataList from '@/features/Admin/Analytics/ui/BlogDataList';
import { getBlogData } from '@/features/Admin/Analytics/hooks/getBlogData';

export const metadata: Metadata = {
  title: 'Admin',
};
export default async function AdminPage() {
  const data = await getBlogData();
  const { adminData } = data;
  return (
    <div className="flex flex-wrap justify-start gap-4">
      <BlogDataList adminData={adminData} />
    </div>
  );
}
