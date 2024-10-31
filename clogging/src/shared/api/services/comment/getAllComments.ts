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

      const repliesRef = collection(commentDoc.ref, 'replies');
      const repliesSnapshot = await getDocs(repliesRef);
      const repliesCount = repliesSnapshot.size;

      return {
        id: commentDoc.id,
        postId,
        ...commentData,
        createdAt: formattedCreatedAt,
        repliesCount,
      };
    }),
  );

  return {
    comments,
    totalComments: commentsSnapshot.size,
  };
}
