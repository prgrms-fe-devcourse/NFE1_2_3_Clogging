'use client';
import { useTheme } from '@/shared/providers/theme/useTheme';
import { mockPosts } from '@/mocks/data/posts';
import HorizontalPostCard from '@/features/Post/ui/Card/HorizontalPostCard';
import { useBannerStore } from '@/store/useBannerSotre';
import TagSection from '@/features/Tag/ui/TagSection'; // TagSection import
import { useTagStore } from '@/store/useTagStore'; // useTagStore import

const FeedPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const bannerImage = useBannerStore((state) => state.bannerImage);
  const selectedTags = useTagStore((state) => state.selectedTags);

  // 모든 포스트의 태그 수집
  const allTags = mockPosts.flatMap((post) => post.tags);

  // 선택된 태그에 따라 포스트 필터링
  const filteredPosts =
    selectedTags.length > 0
      ? selectedTags.includes('기타')
        ? mockPosts
        : mockPosts.filter((post) =>
            post.tags.some((tag) => selectedTags.includes(tag)),
          )
      : mockPosts;

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'
      }`}
    >
      <div className="container mx-auto py-8">
        {/* 배너 영역 */}
        <div className="w-full h-[400px] relative overflow-hidden mb-7 rounded-lg">
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

        {/* 태그 섹션 - py-8 추가 */}
        <div className="py-8">
          <TagSection tags={allTags} />
        </div>

        {/* 포스트 목록 */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <HorizontalPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
