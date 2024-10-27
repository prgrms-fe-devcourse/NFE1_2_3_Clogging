'use client';
import { useTheme } from '@/contexts/ThemeContext';
import { mockPosts } from '@/shared/api/mocks/posts';
import HorizontalPostCard from '@/components/HorizontalPostCard/HorizontalPostCard';

const FeedPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'
      }`}
    >
      <div className="container mx-auto py-8">
        {/* 헤더 영역 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">피드</h1>
          <p
            className={`text-lg ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            최신 포스트 목록
          </p>
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
