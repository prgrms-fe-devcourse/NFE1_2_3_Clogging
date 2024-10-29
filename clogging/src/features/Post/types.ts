import { Timestamp } from 'firebase/firestore';

export interface Post {
  id: string;
  categoryId: string;
  userId: number;
  title: string;
  content: string;
  img?: string;
  viewCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
