// app/api/search/route.ts
import { NextResponse } from 'next/server';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') || '';
    const postsRef = collection(db, 'posts');

    // 제목 검색 쿼리 수정
    const titleQuery = query(
      postsRef,
      orderBy('title'), // 먼저 title로 정렬
      where('title', '>=', keyword),
      where('title', '<=', keyword + '\uf8ff'),
    );

    const querySnapshot = await getDocs(titleQuery);

    // 결과를 createdAt으로 정렬
    const posts = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: (data.createdAt as Timestamp).toMillis(),
          updatedAt: (data.updatedAt as Timestamp).toMillis(),
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt); // 최신순 정렬

    return NextResponse.json({
      message: '검색 성공',
      posts,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: '검색 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
