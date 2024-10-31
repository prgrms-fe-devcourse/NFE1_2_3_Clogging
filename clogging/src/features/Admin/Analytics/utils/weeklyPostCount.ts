import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export const weeklyPostCount = async () => {
  const postsRef = collection(db, 'posts');
  const postsQuery = query(postsRef, orderBy('createdAt', 'asc'));
  const querySnapshot = await getDocs(postsQuery);

  const weeklyCounts: Record<string, number> = {};

  querySnapshot.docs.forEach((doc) => {
    const postData = doc.data();
    const createdAtTimestamp = postData.createdAt as Timestamp;
    const createdAt = createdAtTimestamp.toDate();

    // 주의 시작일을 계산
    const startOfWeek = new Date(createdAt);
    startOfWeek.setDate(createdAt.getDate() - createdAt.getDay()); // 일요일 기준으로 설정

    // 날짜 포맷을 'YYYY-MM-DD'로 변경
    const yearWeek = `${startOfWeek.getFullYear()}-${String(startOfWeek.getMonth() + 1).padStart(2, '0')}-${String(startOfWeek.getDate()).padStart(2, '0')}`;

    if (!weeklyCounts[yearWeek]) {
      weeklyCounts[yearWeek] = 0;
    }
    weeklyCounts[yearWeek]++;
  });

  return Object.entries(weeklyCounts).map(([date, uv]) => ({
    date: date,
    uv: uv,
  }));
};
