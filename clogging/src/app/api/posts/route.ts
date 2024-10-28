import { NextResponse } from 'next/server';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const lastPostId = searchParams.get('lastPostId');

    const postsRef = collection(db, 'posts');
    let postsQuery;

    if (lastPostId) {
      const lastDocQuery = query(
        postsRef,
        orderBy('createdAt', 'desc'),
        limit(1),
      );
      const lastDocSnapshot = await getDocs(lastDocQuery);
      const lastDoc = lastDocSnapshot.docs[0];

      postsQuery = query(
        postsRef,
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize),
      );
    } else {
      postsQuery = query(
        postsRef,
        orderBy('createdAt', 'desc'),
        limit(pageSize),
      );
    }

    const querySnapshot = await getDocs(postsQuery);

    const posts = querySnapshot.docs.map((doc) => {
      const createdAtTimestamp = doc.data().createdAt as Timestamp;
      const createdAt = createdAtTimestamp.toDate();
      const year = createdAt.getFullYear();
      const month = String(createdAt.getMonth() + 1).padStart(2, '0');
      const day = String(createdAt.getDate()).padStart(2, '0');

      return {
        id: doc.id,
        ...doc.data(),
        createdAt: `${year}${month}${day}`,
      };
    });

    return NextResponse.json({
      posts,
    });
  } catch (error) {
    console.error('포스트 Fetch Error!:', error);
    return NextResponse.json(
      { error: '포스트를 불러오는데 실패했습니다.' },
      { status: 500 },
    );
  }
}
