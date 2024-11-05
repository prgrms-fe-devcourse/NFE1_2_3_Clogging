'use client';
import { useTheme } from '@/shared/providers/theme';
import PostCard from '@/features/Post/ui/Card/PostCard';
import { Button } from '@/shared/ui/common/Button';
import { Section } from '@/features/Profile/ui/Section';
import { usePostFilter, useFilteredPosts } from '@/features/Post/hooks';
import { useEffect, useRef, useCallback } from 'react';

const HomePage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { sortType, setSortType, setLastDoc } = usePostFilter();
  const { data, isLoading, error } = useFilteredPosts();
  const observer = useRef<IntersectionObserver | null>(null);

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
  }, [sortType]);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'
      }`}
    >
      <div className="">
        {/* 프로필 섹션 */}
        <Section />

        {/* 정렬 버튼 */}
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

        {/* 에러 상태 */}
        {error && (
          <div className="text-red-500 text-center py-4">
            게시글을 불러오는데 실패했습니다.
          </div>
        )}

        {/* 게시물 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {data?.posts.map((post, index) => (
            <div
              key={post.id}
              ref={
                index === data.posts.length - 1 ? lastPostElementRef : undefined
              }
            >
              <PostCard post={post} />
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
        {!isLoading && !error && data?.posts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            게시글이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
