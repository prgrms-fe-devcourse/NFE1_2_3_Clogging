import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export const dailyCommentCount = async () => {
  const postsRef = collection(db, 'posts');
  const postsQuery = query(postsRef);
  const postsSnapshot = await getDocs(postsQuery);

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  // 일별 댓글 수를 저장할 객체
  const dailyCounts: Record<string, number> = {};

  // 모든 포스트에 대해 댓글을 가져옴
  await Promise.all(
    postsSnapshot.docs.map(async (postDoc) => {
      const postId = postDoc.id;
      const commentsRef = collection(db, 'posts', postId, 'comments');
      const commentsQuery = query(commentsRef, orderBy('createdAt', 'asc'));
      const commentsSnapshot = await getDocs(commentsQuery);

      commentsSnapshot.docs.forEach((commentDoc) => {
        const commentData = commentDoc.data();
        const createdAtTimestamp = commentData.createdAt as Timestamp;
        const createdAtDate = createdAtTimestamp.toDate();

        // 최근 7일 이내의 댓글만 처리
        if (createdAtDate >= sevenDaysAgo) {
          const formattedDate = `${createdAtDate.getFullYear()}-${String(createdAtDate.getMonth() + 1).padStart(2, '0')}-${String(createdAtDate.getDate()).padStart(2, '0')}`;

          if (!dailyCounts[formattedDate]) {
            dailyCounts[formattedDate] = 0;
          }
          dailyCounts[formattedDate]++;
        }
      });
    }),
  );

  // 차트 데이터 형식으로 변환
  return Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    count: count,
  }));
};
