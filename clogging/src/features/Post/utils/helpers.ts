import { ref, uploadBytes, deleteObject } from 'firebase/storage';
import { Timestamp } from 'firebase/firestore';
import { storage } from '@/shared/lib/firebase';

interface UploadImageResult {
  updatedImageIds: string[];
}

export async function uploadImage(
  image: File | null,
  existingImagePaths: string[],
  imagesToDeleteId: string[] | null,
): Promise<UploadImageResult> {
  const uploadedImageIds: string[] = [];

  try {
    if (imagesToDeleteId && imagesToDeleteId.length > 0) {
      await Promise.all(
        imagesToDeleteId.map(async (imagePath) => {
          const existingImageRef = ref(storage, `posts/${imagePath}`);
          await deleteObject(existingImageRef);
        }),
      );
    }

    if (image) {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${image.name}`;
      const newImageRef = ref(storage, `posts/${fileName}`);
      await uploadBytes(newImageRef, image);
      uploadedImageIds.push(fileName);
    }

    const updatedImageIds = existingImagePaths.filter(
      (path) => !imagesToDeleteId?.includes(path),
    );
    return {
      updatedImageIds: [...updatedImageIds, ...uploadedImageIds],
    };
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw new Error(
      `Upload image failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

interface PostData {
  title: string;
  content: string;
  image: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export async function createPostData(
  title: string,
  content: string,
  image: File | null,
  imagesToDeleteId: string[] | null,
): Promise<PostData> {
  const { updatedImageIds } = await uploadImage(image, [], imagesToDeleteId);

  const postData: PostData = {
    title,
    content,
    image: updatedImageIds,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  return postData;
}
