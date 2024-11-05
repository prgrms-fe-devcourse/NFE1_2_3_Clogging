'use client';
import { useTheme } from '@/shared/providers/theme/useTheme';
import HorizontalPostCard from '@/features/Post/ui/Card/HorizontalPostCard';
import { useBannerStore } from '@/store/useBannerSotre';
import TagSection from '@/features/Tag/ui/TagSection';
import CategorySection from '@/features/Category/ui/CategorySection';
import { useTagStore } from '@/store/useTagStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { usePostFilter, useFilteredPosts } from '@/features/Post/hooks';
import { useEffect, useRef, useCallback } from 'react';
import { useCategories } from '@/features/Category/hooks';
import { useFetchSettings } from '@/features/Admin/Blog-settings/hooks/useFetchSettings';

const PostPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const bannerImage = useBannerStore((state) => state.bannerImage);
  const selectedTags = useTagStore((state) => state.selectedTags);
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  const { sortType, setSortType, setLastDoc } = usePostFilter();
  const { data, isLoading, error } = useFilteredPosts();
  const { categories, fetchCategories } = useCategories();
  const { settingsData } = useFetchSettings();
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && data?.hasMore) {
          setLastDoc(data.lastVisible);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, data?.hasMore, setLastDoc],
  );

  useEffect(() => {
    setLastDoc(null);
  }, [sortType, selectedCategory, selectedTags]);

  const allTags = data?.posts.flatMap((post) => post.tags || []) || [];
  const uniqueTags = [...new Set(allTags)];

  // 수정된 필터링 로직
  const filteredPosts = data?.posts.filter((post) => {
    // 카테고리 필터링 - post.category 직접 비교
    const matchesCategory = selectedCategory
      ? post.category === selectedCategory
      : true;

    // 태그 필터링
    const matchesTags =
      selectedTags.length > 0
        ? selectedTags.includes('기타')
          ? true
          : (post.tags?.some((tag) => selectedTags.includes(tag)) ?? false)
        : true;

    return matchesCategory && matchesTags;
  });

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'
      }`}
    >
      {/* 나머지 JSX는 동일 */}
      <div className="container mx-auto py-8">
        {/* 배너 이미지 */}
        <div className="w-full h-[400px] relative overflow-hidden mb-7 rounded-lg">
          <img
            src={settingsData?.bannerUrl || '/images/banner-img.png'}
            alt="Feed Banner"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/banner-img.png';
            }}
          />
        </div>

        {/* 태그 섹션 */}
        <div className="py-8">
          <TagSection tags={uniqueTags} />
        </div>

        <div className="flex gap-8">
          <div className="flex-1">
            {error && (
              <div className="text-red-500 text-center py-4">
                게시글을 불러오는데 실패했습니다.
              </div>
            )}

            {/* 게시글 목록 */}
            <div className="space-y-6">
              {filteredPosts?.map((post, index) => (
                <div
                  key={post.id}
                  ref={
                    index === filteredPosts.length - 1
                      ? lastPostElementRef
                      : undefined
                  }
                >
                  <HorizontalPostCard post={post} />
                </div>
              ))}
            </div>

            {isLoading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
              </div>
            )}

            {!isLoading &&
              !error &&
              (!filteredPosts || filteredPosts.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  게시글이 없습니다.
                </div>
              )}
          </div>

          {/* 큰 화면에서 사이드바로 카테고리 표시 */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-8">
              <CategorySection />
            </div>
          </div>
        </div>

        {/* 작은 화면에서 하단에 카테고리 표시 */}
        <div className="block lg:hidden mt-8">
          <CategorySection />
        </div>
      </div>
    </div>
  );
};

export default PostPage;
