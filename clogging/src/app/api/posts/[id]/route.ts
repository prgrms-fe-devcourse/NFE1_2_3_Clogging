import { NextResponse } from 'next/server';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
  increment,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

const formatDate = (timestamp: Timestamp) => {
  const date = timestamp.toDate();
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

const commentFormatDate = (timestamp: Timestamp) => {
  const date = timestamp.toDate();
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  };
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const postId = params.id;
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      return NextResponse.json(
        { error: '상세 포스트를 찾을 수 없음!' },
        { status: 404 },
      );
    }

    await updateDoc(postRef, {
      viewCount: increment(1),
    });

    const postData = postDoc.data();
    const createdAt = formatDate(postData.createdAt as Timestamp);
    const updatedAt = formatDate(postData.updatedAt as Timestamp);

    const commentsQuery = query(
      collection(db, 'posts', postId, 'comments'),
      orderBy('createdAt', 'asc'),
    );
    const commentsSnapshot = await getDocs(commentsQuery);

    let repliesTotalCount = 0;

    const comments = await Promise.all(
      commentsSnapshot.docs.map(async (commentDoc) => {
        const commentData = commentDoc.data();
        // 댓글은 년,월,일,시,분,초
        const commentCreatedAt = commentFormatDate(
          commentData.createdAt as Timestamp,
        );

        const repliesQuery = query(
          collection(db, 'posts', postId, 'comments', commentDoc.id, 'replies'),
          orderBy('createdAt', 'asc'),
        );
        const repliesSnapshot = await getDocs(repliesQuery);
        repliesTotalCount += repliesSnapshot.size;

        const replies = repliesSnapshot.docs.map((replyDoc) => {
          const replyData = replyDoc.data();
          // 답글은 년,월,일,시,분,초
          const replyCreatedAt = commentFormatDate(
            replyData.createdAt as Timestamp,
          );

          return {
            id: replyDoc.id,
            ...replyData,
            createdAt: replyCreatedAt,
          };
        });

        return {
          id: commentDoc.id,
          ...commentData,
          createdAt: commentCreatedAt,
          replies,
        };
      }),
    );

    const post = {
      id: postDoc.id,
      ...postData,
      createdAt,
      updatedAt,
      comments,
      commentCount: commentsSnapshot.size + repliesTotalCount,
      viewCount: (postData.viewCount || 0) + 1,
    };

    return NextResponse.json({ message: '상세 포스트 조회 성공!', post });
  } catch (error) {
    return NextResponse.json(
      { error: '상세 포스트 조회 실패!' },
      { status: 500 },
    );
  }
}
