'use client';
import { useTheme } from '@/contexts/ThemeContext';
import PostCard from '@/components/post_card/PostCard';

const HomePage: React.FC = () => {
  const { isDarkMode } = useTheme();

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

  return (
    <div
      className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}
    >
      <div className="container py-8">
        <h1 className="font-heading text-2xl mb-6">최신 포스트</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {samplePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
