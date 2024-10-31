import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export const monthlyPostCount = async () => {
  const postsRef = collection(db, 'posts');
  const postsQuery = query(postsRef, orderBy('createdAt', 'asc'));
  const querySnapshot = await getDocs(postsQuery);

  const monthlyCounts: Record<string, number> = {};

  querySnapshot.docs.forEach((doc) => {
    const postData = doc.data();
    const createdAtTimestamp = postData.createdAt as Timestamp;
    const createdAt = createdAtTimestamp.toDate();

    // Format the date to 'YYYY-MM'
    const yearMonth = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyCounts[yearMonth]) {
      monthlyCounts[yearMonth] = 0;
    }
    monthlyCounts[yearMonth]++;
  });

  return Object.entries(monthlyCounts).map(([date, uv]) => ({
    date: date,
    uv: uv,
  }));
};
