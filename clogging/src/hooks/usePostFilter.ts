import { create } from 'zustand';

type SortType = 'latest' | 'trending';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  comments: number;
  views: number;
  thumbnailUrl: string;
  url: string;
}

interface PostStore {
  sortType: SortType;
  posts: Post[];
  setSortType: (type: SortType) => void;
  getSortedPosts: () => Post[];
}

export const usePostStore = create<PostStore>((set, get) => ({
  sortType: 'latest',
  // 기존 샘플 데이터를 store에 포함
  posts: [
    {
      id: '1',
      title: '2024년 개발자 로드맵',
      excerpt:
        '프론트엔드 개발자가 되기 위해 필요한 기술 스택과 학습 방향을 정리했습니다. React, TypeScript, 그리고 다양한 최신 도구들에 대해 알아보세요.',
      date: '2024년 08월 13일',
      comments: 20,
      views: 1234,
      thumbnailUrl: '/images/card-thumbnail.png', // 플레이스홀더 이미지로 변경
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
      thumbnailUrl: '/images/card-thumbnail.png',
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
      thumbnailUrl: '/images/card-thumbnail.png',
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
      thumbnailUrl: '/images/card-thumbnail.png',
      url: '#',
    },
  ],
  setSortType: (type) => set({ sortType: type }),
  getSortedPosts: () => {
    const { posts, sortType } = get();
    const sorted = [...posts];

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
  },
}));
