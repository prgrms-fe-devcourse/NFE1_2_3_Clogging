import { Post } from '@/features/Post/types';

export const mockPosts: Post[] = [
  {
    id: 'B16msATzccos8zKa46ug',
    categoryId: '1',
    userId: 1,
    title: '첫 번째 포스트입니다',
    content:
      '## 첫 번째 섹션\n\n이것은 첫 번째 포스트의 내용입니다...\n\n## 두 번째 섹션\n\n더 많은 내용이 있습니다...',
    img: 'https://picsum.photos/800/400', // 임시 이미지 URL 추가
    viewCount: 150,
    isDeleted: false,
    createdAt: '2024-03-25T12:00:00Z',
    updatedAt: '2024-03-25T12:00:00Z',
    tags: ['JavaScript', 'React'],
  },
  {
    id: 'ICOPE5dXNx3tlL3489AW',
    categoryId: '2',
    userId: 1,
    title: '두 번째 포스트입니다',
    content: '두 번째 포스트의 내용입니다...',
    img: 'https://picsum.photos/800/400',
    viewCount: 120,
    isDeleted: false,
    createdAt: '2024-03-26T12:00:00Z',
    updatedAt: '2024-03-26T12:00:00Z',
    tags: ['Next.js', 'TypeScript'],
  },
  {
    id: 'idGMzPvNhmpsLvvh18bf',
    categoryId: '3',
    userId: 1,
    title: '세 번째 포스트입니다',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula nibh, interdum non enim sit amet, iaculis aliquet nunc. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam sit amet ipsum ac velit egestas ultrices. Vestibulum et neque id ex semper varius a sit amet metus. Vivamus congue dolor eget aliquam hendrerit. Etiam iaculis finibus egestas. Nam viverra urna quis odio efficitur malesuada. Maecenas rhoncus enim eu scelerisque rutrum. Pellentesque et mollis enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed commodo leo. Suspendisse potenti. Maecenas gravida ipsum placerat ligula posuere, ut rhoncus velit eleifend.',
    img: 'https://picsum.photos/800/400',
    viewCount: 0,
    isDeleted: true,
    createdAt: '2024-10-30T09:00:00Z',
    updatedAt: '2024-10-30T09:00:00Z',
    tags: ['Next.js', 'TypeScript', 'Clogging', 'frontend'],
  },
];
