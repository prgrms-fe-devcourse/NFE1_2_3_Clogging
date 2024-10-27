// createPostData 등 게시물 관련 헬퍼

import { Timestamp } from 'firebase/firestore';
import { PostData } from '../types';
import { uploadImage } from '@/shared/lib/storage/uploadImage';

export async function createPostData(
  title: string,
  content: string,
  image: File | null,
  imagesToDeleteId: string[] | null,
): Promise<PostData> {
  const { updatedImageIds } = await uploadImage(image, [], imagesToDeleteId);

  return {
    title,
    content,
    image: updatedImageIds,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}
