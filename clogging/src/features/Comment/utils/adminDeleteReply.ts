import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function adminDeleteReply(
  replyId: string,
  commentId: string,
  postId: string,
) {
  try {
    // 답글의 Firestore 문서 참조 생성
    const replyRef = doc(
      db,
      'posts',
      postId,
      'comments',
      commentId,
      'replies',
      replyId,
    );

    // 답글 삭제
    await deleteDoc(replyRef);

    return true; // 삭제 성공 시 true 반환
  } catch (error) {
    console.error('Error deleting reply:', error);
    return false; // 삭제 실패 시 false 반환
  }
}
