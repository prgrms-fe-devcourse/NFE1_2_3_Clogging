// 공통 타입 정의

export interface Post {
  id: string;
  categoryId: number;
  userId: number;
  title: string;
  content: string;
  viewCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface Comment {
  id: string;
  postId: string;
  nickname: string;
  content: string;
  password: string;
  isPrivate: boolean;
  isAuthor: boolean;
  createdAt: string;
}
