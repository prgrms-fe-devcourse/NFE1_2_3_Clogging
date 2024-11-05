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

  const filteredPosts = data?.posts.filter((post) => {
    const matchesCategory = selectedCategory
      ? post.category === selectedCategory
      : true;

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
      <div className="py-8 sm:py-12">
        <div className="w-full h-[200px] sm:h-[300px] md:h-[400px] relative overflow-hidden mb-6 sm:mb-10 rounded-lg">
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

        <div className="py-6 sm:py-10">
          <TagSection tags={uniqueTags} />
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-10">
          <div className="flex-1">
            {error && (
              <div className="text-red-500 text-center py-6">
                게시글을 불러오는데 실패했습니다.
              </div>
            )}

            <div className="space-y-6 sm:space-y-8">
              {filteredPosts?.map((post, index) => (
                <div
                  key={post.id}
                  ref={
                    index === filteredPosts.length - 1
                      ? lastPostElementRef
                      : undefined
                  }
                  className="w-full"
                >
                  <HorizontalPostCard post={post} />
                </div>
              ))}
            </div>

            {isLoading && (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
              </div>
            )}

            {!isLoading &&
              !error &&
              (!filteredPosts || filteredPosts.length === 0) && (
                <div className="text-center py-10 text-gray-500">
                  게시글이 없습니다.
                </div>
              )}
          </div>

          {/* 모바일에서는 카테고리 섹션이 하단에 위치 */}
          <div className="lg:hidden w-full text-center">
            <CategorySection />
          </div>

          {/* 데스크톱에서는 카테고리 섹션이 오른쪽에 위치 */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-8">
              <CategorySection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
