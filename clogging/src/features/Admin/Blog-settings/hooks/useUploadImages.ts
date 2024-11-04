import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/shared/lib/firebase';

export const useUploadImages = () => {
  const uploadFile = async (file: File | null, path: string) => {
    if (!file) return '';

    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);

    return await getDownloadURL(fileRef);
  };

  return { uploadFile };
};
