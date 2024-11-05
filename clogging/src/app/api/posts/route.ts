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
    const pageSize = parseInt(searchParams.get('pageSize') || '100');
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

        // 1029 - 댓글 필드 조회 추가
        const commentsQuery = query(
          collection(db, 'posts', doc.id, 'comments'),
          orderBy('createdAt', 'asc'),
        );
        const commentsSnapshot = await getDocs(commentsQuery);

        const comments = await Promise.all(
          commentsSnapshot.docs.map(async (commentDoc) => {
            const commentData = commentDoc.data();
            const commentCreatedAtTimestamp =
              commentData.createdAt as Timestamp;
            const commentCreatedAt = commentCreatedAtTimestamp.toDate();
            const formattedCommentCreatedAt = `${commentCreatedAt.getFullYear()}${String(
              commentCreatedAt.getMonth() + 1,
            ).padStart(2, '0')}${String(commentCreatedAt.getDate()).padStart(
              2,
              '0',
            )}`;

            const repliesQuery = query(
              collection(
                db,
                'posts',
                doc.id,
                'comments',
                commentDoc.id,
                'replies',
              ),
              orderBy('createdAt', 'asc'),
            );
            const repliesSnapshot = await getDocs(repliesQuery);
            const replies = repliesSnapshot.docs.map((replyDoc) => {
              const replyData = replyDoc.data();
              const replyCreatedAtTimestamp = replyData.createdAt as Timestamp;
              const replyCreatedAt = replyCreatedAtTimestamp.toDate();
              const formattedReplyCreatedAt = `${replyCreatedAt.getFullYear()}${String(
                replyCreatedAt.getMonth() + 1,
              ).padStart(2, '0')}${String(replyCreatedAt.getDate()).padStart(
                2,
                '0',
              )}`;

              return {
                id: replyDoc.id,
                ...replyData,
                createdAt: formattedReplyCreatedAt,
              };
            });

            return {
              id: commentDoc.id,
              ...commentData,
              createdAt: formattedCommentCreatedAt,
              replies,
            };
          }),
        );

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
    console.error('Fetch 에러:', error);
    return NextResponse.json({ error: '포스트 호출 실패' }, { status: 500 });
  }
}
