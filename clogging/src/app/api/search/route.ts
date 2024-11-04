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
import { Post } from '@/features/Post/types'; // Post 타입 import 추가

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') || '';
    const postsRef = collection(db, 'posts');

    // 제목 검색 쿼리
    const titleQuery = query(
      postsRef,
      orderBy('title'),
      where('title', '>=', keyword),
      where('title', '<=', keyword + '\uf8ff'),
    );

    // 내용 검색 쿼리
    const contentQuery = query(
      postsRef,
      orderBy('content'),
      where('content', '>=', keyword),
      where('content', '<=', keyword + '\uf8ff'),
    );

    // 두 쿼리 결과를 동시에 가져오기
    const [titleSnapshot, contentSnapshot] = await Promise.all([
      getDocs(titleQuery),
      getDocs(contentQuery),
    ]);

    // 결과를 합치고 중복 제거
    const seenIds = new Set<string>();
    const posts: Post[] = []; // Post 타입 명시

    // 문서를 Post 타입으로 변환하는 함수
    const convertDocToPost = (doc: any): Post => {
      const data = doc.data();
      return {
        id: doc.id,
        categoryId: data.categoryId,
        userId: data.userId,
        title: data.title,
        content: data.content,
        img: data.img,
        viewCount: data.viewCount,
        isDeleted: data.isDeleted,
        createdAt: (data.createdAt as Timestamp).toMillis(),
        updatedAt: data.updatedAt,
        tags: data.tags || [],
        image: data.image || [],
      };
    };

    // 제목 검색 결과 추가
    titleSnapshot.docs.forEach((doc) => {
      if (!seenIds.has(doc.id)) {
        seenIds.add(doc.id);
        posts.push(convertDocToPost(doc));
      }
    });

    // 내용 검색 결과 추가
    contentSnapshot.docs.forEach((doc) => {
      if (!seenIds.has(doc.id)) {
        seenIds.add(doc.id);
        posts.push(convertDocToPost(doc));
      }
    });

    // 최신순으로 정렬
    posts.sort((a, b) => b.createdAt - a.createdAt);

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
