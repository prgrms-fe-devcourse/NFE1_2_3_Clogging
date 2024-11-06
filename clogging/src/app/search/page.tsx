'use client';
import { useTheme } from '@/shared/providers/theme';
import { SearchBar } from '@/shared/ui/Form/SearchBar';
import HorizontalPostCard from '@/features/Post/ui/Card/HorizontalPostCard';
import { useState } from 'react';
import { useSearch } from '@/features/Search/hooks';
import { Post } from '@/features/Post/types';

const SearchPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [keyword, setKeyword] = useState('');
  const { data, isLoading, error } = useSearch({ keyword });

  const handleSearch = (searchText: string) => {
    setKeyword(searchText);
  };

  const filteredPosts =
    data?.posts?.filter((post: Post) => !post.isDeleted) || [];

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'
      }`}
    >
      <div className="">
        {/* 검색 섹션 */}
        <div className="max-w-3xl mx-auto mb-12">
          <SearchBar
            placeholder="제목이나 내용으로 검색하세요"
            onSearch={handleSearch}
            buttonText="검색"
          />
        </div>

        {/* 검색 결과 섹션 */}
        <div className="max-w-5xl mx-auto">
          {/* 검색어가 있을 때만 결과 수 표시 */}
          {keyword && filteredPosts.length > 0 && (
            <div className="mb-6 text-lg">
              총 {filteredPosts.length}개의 포스트를 찾았습니다.
            </div>
          )}

          {/* 검색 결과 목록 */}
          {filteredPosts.length > 0 && (
            <div className="space-y-6">
              {filteredPosts.map((post: Post) => (
                <div
                  key={post.id}
                  className="transition-all duration-200 hover:transform hover:-translate-y-1"
                >
                  <HorizontalPostCard post={post} />
                </div>
              ))}
            </div>
          )}

          {/* 로딩 상태 */}
          {isLoading && (
            <div className="flex justify-center items-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary"></div>
            </div>
          )}

          {/* 검색 결과가 없는 경우 */}
          {!isLoading && !error && keyword && filteredPosts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">검색 결과가 없습니다.</p>
              <p className="text-sm text-gray-400">
                다른 검색어로 시도해보세요.
              </p>
            </div>
          )}

          {/* 초기 상태 */}
          {!keyword && !isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-500">검색어를 입력하세요.</p>
              <p className="text-sm text-gray-400 mt-2">
                게시글의 제목이나 내용에 포함된 단어로 검색할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
