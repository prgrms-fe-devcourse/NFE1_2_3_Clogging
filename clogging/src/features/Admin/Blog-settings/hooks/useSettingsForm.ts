import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '@/shared/lib/firebase';

export function useSettingsForm() {
  const [settings, setSettings] = useState({
    profileImage: null,
    nickname: '',
    description: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name: string, file: File | null) => {
    if (file) {
      // 파일 이름만 상태에 저장
      setSettings((prev) => ({ ...prev, [name]: file.name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const docId = 'am6u16JKqEO0haSkbmbb'; // Firestore 문서 ID

    // 프로필 이미지 업로드 및 Firestore 업데이트
    if (settings.profileImage) {
      const file = settings.profileImage; // 상태에서 파일 객체 가져오기
      const storageRef = ref(storage, `settings/${file.name}`);

      try {
        await uploadBytes(storageRef, file); // Firebase Storage에 파일 업로드
        const fileUrl = `https://firebasestorage.googleapis.com/v0/b/clogging-d3b17.appspot.com/o/settings%2F${settings.profileImage}?alt=media`;

        // Firestore에 URL 업데이트
        await updateDoc(doc(db, 'settings', docId), {
          profileImageUrl: fileUrl,
        });

        alert('프로필 사진이 성공적으로 업로드되었습니다.');
      } catch (error) {
        console.error('파일 업로드 실패:', error);
        alert('파일 업로드에 실패했습니다.');
      }
    }

    // 다른 필드 업데이트
    await updateDoc(doc(db, 'settings', docId), {
      nickname: settings.nickname,
      description: settings.description,
    });
  };

  return {
    settings,
    handleInputChange,
    handleFileChange,
    handleSubmit,
  };
}
