import { Comment } from '@/features/Comment/types';

export const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    nickname: '홍길동',
    content: '좋은 글 감사합니다!',
    password: '0000',
    isPrivate: false,
    isAuthor: false,
    createdAt: '2024-03-25T12:30:00Z',
  },
  {
    id: '2',
    postId: '1',
    nickname: '작성자',
    content: '댓글 감사합니다 :)',
    password: '0000',
    isPrivate: false,
    isAuthor: true,
    createdAt: '2024-03-25T13:00:00Z',
  },
];
