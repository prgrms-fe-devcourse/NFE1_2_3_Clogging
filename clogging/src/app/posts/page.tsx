'use client';
import { useTheme } from '@/shared/providers/theme/useTheme';
import HorizontalPostCard from '@/features/Post/ui/Card/HorizontalPostCard';
import { useBannerStore } from '@/store/useBannerSotre';
import TagSection from '@/features/Tag/ui/TagSection';
import CategorySection from '@/features/Category/ui/CategorySection';
import { useTagStore } from '@/store/useTagStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { usePostFilter, useFilteredPosts } from '@/features/Post/hooks';
import { useEffect, useRef, useCallback, useMemo } from 'react';
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
  }, [sortType, selectedCategory, selectedTags, setLastDoc]);

  const uniqueTags = useMemo(() => {
    const allTags = data?.posts?.flatMap((post) => post.tags || []) || [];
    return [...new Set(allTags)];
  }, [data?.posts]);

  const filteredPosts = useMemo(() => {
    return data?.posts?.filter((post) => {
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
  }, [data?.posts, selectedCategory, selectedTags]);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4">
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

        {/* 메인 컨텐츠 영역 */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* 포스트 목록 */}
          <main className="flex-1 min-w-0">
            <div className="w-full">
              {error && (
                <div className="text-red-500 text-center py-6">
                  게시글을 불러오는데 실패했습니다.
                </div>
              )}

              <div className="space-y-6 w-full">
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
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                </div>
              )}

              {!isLoading &&
                !error &&
                (!filteredPosts || filteredPosts.length === 0) && (
                  <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    게시글이 없습니다.
                  </div>
                )}
            </div>
          </main>

          {/* 카테고리 사이드바 */}
          <aside className="w-72 flex-shrink-0 hidden lg:block">
            <div className="sticky top-8 w-full">
              <CategorySection />
            </div>
          </aside>
        </div>

        {/* 모바일 카테고리 */}
        <div className="block lg:hidden mt-8">
          <CategorySection />
        </div>
      </div>
    </div>
  );
};

export default PostPage;
