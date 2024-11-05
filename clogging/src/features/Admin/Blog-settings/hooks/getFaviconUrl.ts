import { db, storage } from '@/shared/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

export async function getFaviconUrl() {
  try {
    const settingsDoc = await getDoc(
      doc(db, 'settings', '6sC7nsZi1WAief02H7mc'),
    );
    if (settingsDoc.exists()) {
      const { faviconUrl } = settingsDoc.data();
      const storageRef = ref(storage, faviconUrl);
      return await getDownloadURL(storageRef);
    }
    throw new Error('Favicon settings not found');
  } catch (error) {
    console.error('Error fetching favicon URL:', error);
    return '/favicon.ico';
  }
}
