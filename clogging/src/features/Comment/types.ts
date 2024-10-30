export interface Comment {
  id: string;
  postId: string;
  nickname: string;
  content: string;
  password: string;
  isPrivate: boolean;
  isAuthor: boolean;
  createdAt: string;
  parentCommentId?: string;
  replies?: Comment[];
}

export interface CreateCommentDto {
  postId: string;
  nickname: string;
  password: string;
  content: string;
  isPrivate: boolean;
  isAuthor: boolean;
  parentCommentId?: string;
}

export interface UpdateCommentDto {
  id: string;
  postId: string;
  content: string;
  isPrivate: boolean;
  nickname: string;
  password: string;
}
