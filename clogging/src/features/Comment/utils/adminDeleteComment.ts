import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export async function adminDeleteComment(commentId: string, postId: string) {
  try {
    const commentRef = doc(db, 'posts', postId, 'comments', commentId);
    await deleteDoc(commentRef);
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
}
