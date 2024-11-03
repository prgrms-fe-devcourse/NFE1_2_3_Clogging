import { ref, uploadBytes, deleteObject } from 'firebase/storage';
import { storage } from '@/shared/lib/firebase';

interface UploadImageResult {
  updatedImageIds: string[];
}

export async function settingsImageUploadImage(
  image: File | null,
  existingImagePaths: string[],
  imagesToDeleteId: string[] | null,
): Promise<UploadImageResult> {
  const uploadedImageIds: string[] = [];

  try {
    // 기존 이미지 삭제
    if (imagesToDeleteId && imagesToDeleteId.length > 0) {
      await Promise.all(
        imagesToDeleteId.map(async (imagePath) => {
          const existingImageRef = ref(storage, `settings/${imagePath}`); // 경로 수정
          await deleteObject(existingImageRef);
        }),
      );
    }

    // 새 이미지 업로드
    if (image) {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${image.name}`;
      const newImageRef = ref(storage, `settings/${fileName}`); // 경로 수정
      await uploadBytes(newImageRef, image);
      uploadedImageIds.push(fileName);
    }

    // 업데이트된 이미지 ID 반환
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
