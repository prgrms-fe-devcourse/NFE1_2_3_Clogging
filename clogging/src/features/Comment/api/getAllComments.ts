// src/features/Comment/api/getAllComments.ts
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
import { Comment } from '@/features/Comment/types'; // Comment 타입 임포트

export async function getAllComments() {
  const commentsRef = collectionGroup(db, 'comments');

  // 전체 댓글 수 조회를 위한 쿼리
  const totalCommentsQuery = query(commentsRef);
  const totalCommentsSnapshot = await getDocs(totalCommentsQuery);
  const totalCommentsCount = totalCommentsSnapshot.size; // 전체 댓글 수

  // 최신 순으로 정렬된 댓글 조회
  const commentsQuery = query(commentsRef, orderBy('createdAt', 'desc'));
  const commentsSnapshot = await getDocs(commentsQuery);

  const comments: Comment[] = await Promise.all(
    commentsSnapshot.docs.map(async (commentDoc) => {
      const commentData = commentDoc.data();
      const postId = commentDoc.ref.parent.parent?.id;

      // createdAt 필드를 Timestamp로 변환 후 포맷팅
      const createdAtTimestamp = commentData.createdAt as Timestamp;
      const formattedCreatedAt = formatDateTime(createdAtTimestamp.toDate());

      // 답글 가져오기
      const repliesRef = collection(commentDoc.ref, 'replies');
      const repliesQuery = query(repliesRef, orderBy('createdAt', 'desc')); // 최신 순으로 정렬
      const repliesSnapshot = await getDocs(repliesQuery);

      const replies = await Promise.all(
        repliesSnapshot.docs.map(async (replyDoc) => {
          const replyData = replyDoc.data();
          const replyCreatedAtTimestamp = replyData.createdAt as Timestamp;
          const formattedReplyCreatedAt = formatDateTime(
            replyCreatedAtTimestamp.toDate(),
          );

          return {
            id: replyDoc.id,
            postId: replyData.postId,
            content: replyData.content,
            createdAt: formattedReplyCreatedAt, // 문자열로 변환된 날짜
            author: replyData.author,
          };
        }),
      );

      return {
        id: commentDoc.id,
        postId,
        content: commentData.content,
        createdAt: formattedCreatedAt, // 문자열로 변환된 날짜
        author: commentData.author,
        replies, // 댓글에 대한 답글 추가
        repliesCount: replies.length, // 답글 수 추가
      };
    }),
  );

  return {
    comments,
    totalComments: totalCommentsCount, // 전체 댓글 수 반환
  };
}
