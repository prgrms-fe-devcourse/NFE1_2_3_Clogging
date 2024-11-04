import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

// admin 비밀번호 설정 (최초 1회 실행 또는 관리자 페이지에서 실행)
export const setAdminPassword = async (password: string) => {
  try {
    await setDoc(doc(db, 'admin', 'credentials'), {
      password: password,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Admin 비밀번호 설정 실패:', error);
    return false;
  }
};

// admin 비밀번호 확인
export const verifyAdminPassword = async (password: string) => {
  try {
    const adminDoc = await getDoc(doc(db, 'admin', 'credentials'));
    if (!adminDoc.exists()) {
      return false;
    }
    return adminDoc.data().password === password;
  } catch (error) {
    console.error('Admin 비밀번호 확인 실패:', error);
    return false;
  }
};
