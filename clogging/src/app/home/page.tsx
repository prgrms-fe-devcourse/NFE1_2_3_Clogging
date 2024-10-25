'use client';
import { useTheme } from '@/contexts/ThemeContext';
import PostCard from '@/components/post_card/PostCard';
import { Button } from '@/components/ui/common/Button';
import { usePostStore } from '@/hooks/usePostStore';

const HomePage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { sortType, setSortType, getSortedPosts } = usePostStore();
  const posts = getSortedPosts();

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'
      }`}
    >
      <div className="container py-8">
        {/* LNB */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            className={`${
              sortType === 'latest'
                ? 'bg-secondary dark:bg-secondary-dark hover:bg-secondary-hover dark:hover:bg-secondary-darkHover'
                : 'hover:bg-secondary dark:hover:bg-secondary-dark'
            } text-lg font-semibold`}
            onClick={() => setSortType('latest')}
          >
            최신
          </Button>
          <Button
            variant="ghost"
            className={`${
              sortType === 'trending'
                ? 'bg-secondary dark:bg-secondary-dark hover:bg-secondary-hover dark:hover:bg-secondary-darkHover'
                : 'hover:bg-secondary dark:hover:bg-secondary-dark'
            } text-lg font-semibold`}
            onClick={() => setSortType('trending')}
          >
            트렌딩
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
