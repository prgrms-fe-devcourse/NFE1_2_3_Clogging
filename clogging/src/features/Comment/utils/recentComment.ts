import { mockComments } from '@/mocks/data/comments';
import { Comment } from '../types';

export function getRecentMockComments(page: number, limit: number): Comment[] {
  const sortedComments = [...mockComments].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
      console.error('Invalid date:', a.createdAt, b.createdAt);
      return 0;
    }
    return dateB.getTime() - dateA.getTime();
  });

  const startIndex = (page - 1) * limit;
  return sortedComments.slice(startIndex, startIndex + limit);
}
