import { Card, CardContent } from '@/components/ui/common/Card';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin',
};
// 데이터 정의
const adminData = [
  { label: '포스트 수', value: '100 개' },
  { label: '댓글 수', value: '121 개' },
  { label: '총 조회 수', value: '121 회' },
  { label: '총 조회 수', value: '121 회' },
  { label: '총 조회 수', value: '121 회' },
];
export default function AdminPage() {
  return (
    <div className="flex flex-wrap justify-start gap-4">
      {adminData.map((item, index) => (
        <Card
          key={index}
          className={cn(
            'p-3 flex-grow w-full sm:w-[calc(50%-8px)] md:w-[calc(20%-16px)] lg:w-[calc(20%-16px)] xl:w-[calc(20%-16px)]',
          )}
        >
          <CardContent className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#F4F7FE] flex items-center justify-center mr-3">
              <img
                src="/icons/admin_analytics.png"
                alt={item.label}
                className="w-6 h-6"
              />
            </div>
            <div>
              <div className="text-xs text-gray-400">{item.label}</div>
              <div className="text-lg font-semibold">{item.value}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
