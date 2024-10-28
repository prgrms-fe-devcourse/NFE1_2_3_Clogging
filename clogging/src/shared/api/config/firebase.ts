import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Firebase 설정
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
