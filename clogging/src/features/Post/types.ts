import { Timestamp } from 'firebase/firestore';

export interface Post {
  id: string;
  category?: string;
  categoryId?: string;
  userId: number;
  title: string;
  content: string;
  img?: string;
  viewCount: number;
  isDeleted: boolean;
  createdAt: number;
  updatedAt: string;
  tags: string[];
  image: string[]; // 이미지 파일명 배열 추가
}

type SortType = 'latest' | 'trending';

export interface PostFilter {
  sortType: SortType;
  posts: Post[];
  setSortType: (type: SortType) => void;
  getSortedPosts: () => Post[];
}

export interface PostData {
  title: string;
  content: string;
  image: string[];
  category?: string;
  categoryId?: string;
  userId: number; // 추가
  viewCount: number; // 추가
  isDeleted: boolean; // 추가
  tags: string[]; // 추가
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
