import {
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from 'firebase/storage';
import { storage } from '@/shared/lib/firebase'; // Firebase Storage 초기화 파일 경로

export const uploadSettingsImage = async (
  file: File | null,
  existingImagePaths: string[],
  imagesToDeleteId: string[] | null,
): Promise<string[]> => {
  const uploadedImageUrls: string[] = [];

  try {
    // 삭제할 이미지가 있는 경우 삭제
    if (imagesToDeleteId && imagesToDeleteId.length > 0) {
      await Promise.all(
        imagesToDeleteId.map(async (imagePath) => {
          const existingImageRef = ref(storage, `settings/${imagePath}`);
          await deleteObject(existingImageRef);
        }),
      );
    }

    // 새 이미지가 있는 경우 업로드
    if (file) {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const newImageRef = ref(storage, `settings/${fileName}`);
      await uploadBytes(newImageRef, file);

      // 업로드 후 다운로드 URL 가져오기
      const downloadURL = await getDownloadURL(newImageRef);
      uploadedImageUrls.push(downloadURL); // URL을 배열에 추가
    }

    // 기존 이미지 경로에서 삭제된 이미지를 제외한 업데이트된 이미지 URL 반환
    const updatedImageUrls = existingImagePaths.filter(
      (path) => !imagesToDeleteId?.includes(path),
    );

    return [...updatedImageUrls, ...uploadedImageUrls];
  } catch (error) {
    console.error('Error in uploadSettingsImage:', error);
    throw new Error(
      `Upload image failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
