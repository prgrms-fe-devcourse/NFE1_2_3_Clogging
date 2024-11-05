import { ref, uploadBytes, deleteObject } from 'firebase/storage';
import { storage } from '@/shared/lib/firebase';

interface UploadImageResult {
  updatedImageIds: string[];
}

export const uploadImage = async (
  file: File | null,
  existingImagePaths: string[],
  imagesToDelete: string[],
): Promise<{ imageId: string; updatedImageIds: string[] }> => {
  try {
    // 삭제할 이미지 처리
    if (imagesToDelete.length > 0) {
      await Promise.all(
        imagesToDelete.map(async (imagePath) => {
          const imageRef = ref(storage, `posts/${imagePath}`);
          try {
            await deleteObject(imageRef);
          } catch (error) {
            console.error('이미지 삭제 실패:', error);
          }
        }),
      );
    }

    // 새 이미지 업로드
    let imageId = '';
    if (file) {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const storageRef = ref(storage, `posts/${fileName}`);

      // 파일 업로드
      await uploadBytes(storageRef, file);

      imageId = fileName;
    }

    // 업데이트된 이미지 ID 목록 생성
    const updatedImageIds = [
      ...existingImagePaths.filter((id) => !imagesToDelete.includes(id)),
      ...(imageId ? [imageId] : []),
    ];

    return {
      imageId,
      updatedImageIds,
    };
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};
