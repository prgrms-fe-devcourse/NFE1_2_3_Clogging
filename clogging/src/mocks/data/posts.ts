import { Post } from '@/features/Post/types';

export const mockPosts: Post[] = [
  {
    id: '1',
    categoryId: 1,
    userId: 1,
    title: '첫 번째 포스트입니다',
    content:
      '## 첫 번째 섹션\n\n이것은 첫 번째 포스트의 내용입니다...\n\n## 두 번째 섹션\n\n더 많은 내용이 있습니다...',
    viewCount: 150,
    isDeleted: false,
    createdAt: '2024-03-25T12:00:00Z',
    updatedAt: '2024-03-25T12:00:00Z',
    tags: ['JavaScript', 'React'],
  },
  {
    id: '2',
    categoryId: 2,
    userId: 1,
    title: '두 번째 포스트입니다',
    content: '두 번째 포스트의 내용입니다...',
    viewCount: 120,
    isDeleted: false,
    createdAt: '2024-03-26T12:00:00Z',
    updatedAt: '2024-03-26T12:00:00Z',
    tags: ['Next.js', 'TypeScript'],
  },
];
