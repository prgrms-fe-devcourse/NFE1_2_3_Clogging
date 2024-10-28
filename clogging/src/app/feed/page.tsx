// features/Post/pages/FeedPage.tsx
'use client';
import { useTheme } from '@/shared/providers/theme/useTheme';
import { mockPosts } from '@/mocks/data/posts';
import { mockCategories } from '@/mocks/data/categories';
import HorizontalPostCard from '@/features/Post/ui/Card/HorizontalPostCard';
import { useBannerStore } from '@/store/useBannerSotre';
import TagSection from '@/features/Tag/ui/TagSection';
import CategorySection from '@/features/Category/ui/CategorySection';
import { useTagStore } from '@/store/useTagStore';
import { useCategoryStore } from '@/store/useCategoryStore';

const FeedPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const bannerImage = useBannerStore((state) => state.bannerImage);
  const selectedTags = useTagStore((state) => state.selectedTags);
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);

  // 모든 포스트의 태그 수집
  const allTags = mockPosts.flatMap((post) => post.tags);

  // 선택된 태그와 카테고리에 따라 포스트 필터링
  const filteredPosts = mockPosts.filter((post) => {
    const matchesCategory = selectedCategory
      ? post.categoryId === selectedCategory
      : true;
    const matchesTags =
      selectedTags.length > 0
        ? selectedTags.includes('기타')
          ? true
          : post.tags.some((tag) => selectedTags.includes(tag))
        : true;
    return matchesCategory && matchesTags;
  });

  return (
    <div
      className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}
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

        {/* 태그 섹션 - 여백 복원 */}
        <div className="py-8">
          <TagSection tags={allTags} />
        </div>

        {/* 컨텐츠 영역 레이아웃 수정 */}
        <div className="flex gap-8">
          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1">
            {/* 포스트 목록 */}
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <HorizontalPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* 오른쪽 사이드바 - sticky 추가 */}
          <div className="w-72 flex-shrink-0">
            <div className="sticky top-8">
              <CategorySection categories={mockCategories} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FeedPage;
