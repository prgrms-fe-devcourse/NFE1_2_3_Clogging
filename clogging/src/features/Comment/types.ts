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
