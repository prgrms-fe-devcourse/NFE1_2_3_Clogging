// src/lib/api/comments.ts
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
  collectionGroup,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { formatDateTime } from '@/shared/lib/utils/formatDateTime';

export async function getAllComments() {
  const commentsRef = collectionGroup(db, 'comments');
  const commentsQuery = query(commentsRef, orderBy('createdAt', 'desc'));
  const commentsSnapshot = await getDocs(commentsQuery);

  const comments = await Promise.all(
    commentsSnapshot.docs.map(async (commentDoc) => {
      const commentData = commentDoc.data();
      const postId = commentDoc.ref.parent.parent?.id;

      // createdAt 필드를 Timestamp로 변환
      const createdAtTimestamp = commentData.createdAt as Timestamp;
      const createdAtDate = createdAtTimestamp.toDate();

      // formatDateTime 함수를 사용하여 날짜와 시간 포맷팅
      const formattedCreatedAt = formatDateTime(createdAtDate);

      // 답글 가져오기
      const repliesRef = collection(commentDoc.ref, 'replies');
      const repliesQuery = query(repliesRef, orderBy('createdAt', 'asc'));
      const repliesSnapshot = await getDocs(repliesQuery);

      const replies = await Promise.all(
        repliesSnapshot.docs.map(async (replyDoc) => {
          const replyData = replyDoc.data();
          const replyCreatedAtTimestamp = replyData.createdAt as Timestamp;
          const replyCreatedAtDate = replyCreatedAtTimestamp.toDate();
          const formattedReplyCreatedAt = formatDateTime(replyCreatedAtDate);

          return {
            id: replyDoc.id,
            ...replyData,
            createdAt: formattedReplyCreatedAt,
          };
        }),
      );

      return {
        id: commentDoc.id,
        postId,
        ...commentData,
        createdAt: formattedCreatedAt,
        replies, // 댓글에 대한 답글 추가
        repliesCount: replies.length, // 답글 수 추가
      };
    }),
  );

  return {
    comments,
    totalComments: commentsSnapshot.size,
  };
}
