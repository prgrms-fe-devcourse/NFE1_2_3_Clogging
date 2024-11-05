import { NextResponse } from 'next/server';
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { formatDateTime } from '@/shared/lib/utils/formatDateTime';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'postId 없음!' }, { status: 400 });
    }

    const commentsRef = collection(db, 'posts', postId, 'comments');
    const commentsQuery = query(commentsRef, orderBy('createdAt', 'desc'));
    const commentsSnapshot = await getDocs(commentsQuery);

    // 댓글 수 : commentsSnapshot.size 로 확인하면 되어유

    const comments = await Promise.all(
      commentsSnapshot.docs.map(async (commentDoc) => {
        const commentData = commentDoc.data();
        //console.log('댓글 데이터:', commentData);

        const createdAtTimestamp = commentData.createdAt as Timestamp;
        const createdAtDate = createdAtTimestamp.toDate();

        const repliesRef = collection(
          db,
          'posts',
          postId,
          'comments',
          commentDoc.id,
          'replies',
        );
        const repliesSnapshot = await getDocs(repliesRef);
        // ${commentDoc.id}의 답글 개수 : repliesSnapshot.size 로 확인하면 되어유
        // commentDoc.id 댓글아이디

        const replies = repliesSnapshot.docs.map((replyDoc) => {
          const replyData = replyDoc.data();
          const replyCreatedAtTimestamp = replyData.createdAt as Timestamp;
          const replyCreatedAtDate = replyCreatedAtTimestamp.toDate();
          const formattedReplyCreatedAt = `${formatDateTime(replyCreatedAtDate)}`;

          return {
            id: replyDoc.id,
            ...replyData,
            createdAt: formattedReplyCreatedAt,
          };
        });

        return {
          id: commentDoc.id,
          ...commentData,
          createdAt: createdAtDate,
          replies,
        };
      }),
    );

    return NextResponse.json({
      comments,
    });
  } catch (error) {
    return NextResponse.json({ error: '댓글 불러오기 실패!' }, { status: 500 });
  }
}
