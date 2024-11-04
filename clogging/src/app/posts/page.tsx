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
import { useCategories } from '@/features/Category/hooks'; // useCategories hook 추가

const PostPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const bannerImage = useBannerStore((state) => state.bannerImage);
  const selectedTags = useTagStore((state) => state.selectedTags);
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  const { sortType, setSortType, setLastDoc } = usePostFilter();
  const { data, isLoading, error } = useFilteredPosts();
  const { categories, fetchCategories } = useCategories(); // 카테고리 데이터 가져오기
  const observer = useRef<IntersectionObserver | null>(null);

  // 컴포넌트 마운트 시 카테고리 데이터 가져오기
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 무한 스크롤을 위한 Intersection Observer
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

  // 정렬 타입 변경 시 초기화
  useEffect(() => {
    setLastDoc(null);
  }, [sortType, selectedCategory, selectedTags]);

  // 모든 포스트의 태그 수집
  const allTags = data?.posts.flatMap((post) => post.tags || []) || [];
  const uniqueTags = [...new Set(allTags)];

  // 선택된 태그와 카테고리에 따라 포스트 필터링
  const filteredPosts = data?.posts.filter((post) => {
    const matchesCategory = selectedCategory
      ? (categories
          .find((cat) => cat.id === selectedCategory)
          ?.postIds?.includes(post.id) ?? false)
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

        {/* 태그 섹션 */}
        <div className="py-8">
          <TagSection tags={uniqueTags} />
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex gap-8">
          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1">
            {/* 에러 상태 */}
            {error && (
              <div className="text-red-500 text-center py-4">
                게시글을 불러오는데 실패했습니다.
              </div>
            )}

            {/* 포스트 목록 */}
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

            {/* 로딩 상태 */}
            {isLoading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
              </div>
            )}

            {/* 데이터가 없는 경우 */}
            {!isLoading &&
              !error &&
              (!filteredPosts || filteredPosts.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  게시글이 없습니다.
                </div>
              )}
          </div>

          {/* 오른쪽 사이드바 */}
          <div className="w-72 flex-shrink-0">
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
