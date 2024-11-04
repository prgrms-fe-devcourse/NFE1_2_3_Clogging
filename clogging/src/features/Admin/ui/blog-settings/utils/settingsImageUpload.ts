import { storage } from '@/shared/lib/firebase'; // Ensure this imports your Firebase configuration
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const settingsImageUploadImage = async (
  file: File | null,
): Promise<string | null> => {
  if (!file) {
    return null; // Return null if no file is provided
  }

  try {
    const storageRef = ref(storage, `settings/${file.name}`); // Define the storage path
    await uploadBytes(storageRef, file); // Upload the file

    // Get the download URL of the uploaded file
    const url = await getDownloadURL(storageRef);
    return file.name; // Return the filename for Firestore update
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Image upload failed');
  }
};
