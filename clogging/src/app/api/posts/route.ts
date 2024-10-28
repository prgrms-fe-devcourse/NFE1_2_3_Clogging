import { NextResponse } from 'next/server';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  where,
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

    const posts = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const postData = doc.data();
        const createdAtTimestamp = postData.createdAt as Timestamp;
        const createdAt = createdAtTimestamp.toDate();
        const formattedCreatedAt = `${createdAt.getFullYear()}${String(
          createdAt.getMonth() + 1,
        ).padStart(2, '0')}${String(createdAt.getDate()).padStart(2, '0')}`;

        // 20241029 - 댓글 필드 추가
        const commentsQuery = query(
          collection(db, 'comments'),
          where('postId', '==', doc.id),
        );
        const commentsSnapshot = await getDocs(commentsQuery);

        const comments = commentsSnapshot.docs.map((commentDoc) => {
          const commentData = commentDoc.data();
          const commentCreatedAtTimestamp = commentData.createdAt as Timestamp;
          const commentCreatedAt = commentCreatedAtTimestamp.toDate();
          const formattedCommentCreatedAt = `${commentCreatedAt.getFullYear()}${String(
            commentCreatedAt.getMonth() + 1,
          ).padStart(2, '0')}${String(commentCreatedAt.getDate()).padStart(
            2,
            '0',
          )}`;

          return {
            id: commentDoc.id,
            ...commentData,
            createdAt: formattedCommentCreatedAt,
          };
        });

        return {
          id: doc.id,
          ...postData,
          createdAt: formattedCreatedAt,
          comments,
        };
      }),
    );

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
