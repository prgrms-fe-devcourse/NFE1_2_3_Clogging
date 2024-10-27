'use client';
import { useTheme } from '@/contexts/ThemeContext';
import { mockPosts } from '@/shared/api/mocks/posts';
import HorizontalPostCard from '@/components/HorizontalPostCard/HorizontalPostCard';
import { useBannerStore } from '@/store/useBannerSotre';

const FeedPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const bannerImage = useBannerStore((state) => state.bannerImage);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'
      }`}
    >
      <div className="container mx-auto py-8">
        {/* 배너 영역 */}
        <div className="w-full h-[400px] relative overflow-hidden mb-7 rounded-lg">
          {' '}
          <img
            src={bannerImage}
            alt="Feed Banner"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/banner-img.png';
            }}
          />
        </div>

        {/* 포스트 목록 */}
        <div className="space-y-6">
          {mockPosts.map((post) => (
            <HorizontalPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
