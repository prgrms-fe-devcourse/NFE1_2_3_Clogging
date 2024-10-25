'use client';
import { useTheme } from '@/contexts/ThemeContext';
import PostCard from '@/components/post_card/PostCard';
import { Button } from '@/components/ui/common/Button';
import { useState } from 'react';

type SortType = 'latest' | 'trending';

const HomePage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [sortType, setSortType] = useState<SortType>('latest');

  // 테스트용 게시물 데이터
  const samplePosts = [
    {
      id: '1',
      title: '2024년 개발자 로드맵',
      excerpt:
        '프론트엔드 개발자가 되기 위해 필요한 기술 스택과 학습 방향을 정리했습니다. React, TypeScript, 그리고 다양한 최신 도구들에 대해 알아보세요.',
      date: '2024년 08월 13일',
      comments: 20,
      views: 1234,
      thumbnailUrl: 'https://picsum.photos/seed/post1/400/400', // 플레이스홀더 이미지
      url: '#',
    },
    {
      id: '2',
      title: 'Tailwind CSS 실전 가이드',
      excerpt:
        'Tailwind CSS를 활용한 효율적인 스타일링 방법과 커스텀 설정 방법을 소개합니다. 실제 프로젝트 예제와 함께 살펴보세요.',
      date: '2024년 08월 11일',
      comments: 15,
      views: 892,
      thumbnailUrl: 'https://picsum.photos/seed/post2/400/400',
      url: '#',
    },
    {
      id: '3',
      title: 'Next.js 13 주요 변경사항',
      excerpt:
        'Next.js 13의 새로운 기능과 주요 변경사항을 정리했습니다. App Router, Server Components 등 핵심 기능을 자세히 알아보세요.',
      date: '2024년 08월 10일',
      comments: 25,
      views: 1567,
      thumbnailUrl: 'https://picsum.photos/seed/post3/400/400',
      url: '#',
    },
    {
      id: '4',
      title: 'Next.js 15 주요 변경사항이 있습니다. 그것은 무엇일까요?',
      excerpt:
        'Next.js 13의 새로운 기능과 주요 변경사항을 정리했습니다. App Router, Server Components 등 핵심 기능을 자세히 알아보세요.',
      date: '2024년 08월 12일',
      comments: 26,
      views: 167,
      thumbnailUrl: 'https://picsum.photos/seed/post4/400/400',
      url: '#',
    },
  ];

  const getSortedPosts = () => {
    const sorted = [...samplePosts];
    if (sortType === 'latest') {
      return sorted.sort((a, b) => {
        const dateA = new Date(
          a.date.replace('년 ', '-').replace('월 ', '-').replace('일', ''),
        ).getTime();
        const dateB = new Date(
          b.date.replace('년 ', '-').replace('월 ', '-').replace('일', ''),
        ).getTime();
        return dateB - dateA;
      });
    } else {
      return sorted.sort((a, b) => b.views - a.views);
    }
  };

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
          {getSortedPosts().map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
