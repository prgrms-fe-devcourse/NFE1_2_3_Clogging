// getRecentPosts.ts

import { db } from '@/shared/lib/firebase';
import {
  collection,
  query,
  getDocs,
  where,
  DocumentData,
} from 'firebase/firestore';
import { PostData } from '@/features/Post/types';

export async function getRecentPosts(): Promise<PostData[]> {
  const postsRef = collection(db, 'posts');
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentPostsQuery = query(
    postsRef,
    where('createdAt', '>=', sevenDaysAgo),
  );
  const recentPostsSnapshot = await getDocs(recentPostsQuery);

  const recentPosts: PostData[] = recentPostsSnapshot.docs.map((doc) => {
    const data = doc.data() as DocumentData;
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
    };
  });

  return recentPosts;
}
