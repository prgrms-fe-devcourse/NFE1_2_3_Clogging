'use client';
import { useEffect, useState } from 'react';
import { storage, db } from '@/shared/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// 설정 데이터의 타입 정의
interface BlogSettings {
  id: string;
  nickname: string;
  description: string;
  profileImageUrl?: string;
  faviconUrl?: string;
  bannerUrl?: string;
}

// 이미지 타입 정의
type ImageType = 'profile' | 'favicon' | 'banner';

interface SettingsDisplayProps {
  imageType: ImageType; // 어떤 이미지를 표시할지 결정하는 prop
}

function SettingsDisplay({ imageType }: SettingsDisplayProps) {
  const [settingsList, setSettingsList] = useState<BlogSettings[]>([]); // 상태의 타입 지정

  useEffect(() => {
    const fetchSettings = async () => {
      const querySnapshot = await getDocs(collection(db, 'settings'));
      const settingsArray: BlogSettings[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BlogSettings[]; // 가져온 데이터의 타입 지정
      setSettingsList(settingsArray);
    };

    fetchSettings();
  }, []);

  return (
    <div>
      {settingsList.map((setting) => (
        <div key={setting.id} className="p-4">
          {/* 선택된 이미지 타입에 따라 이미지 출력 */}
          {imageType === 'profile' && setting.profileImageUrl && (
            <div className="w-20 h-20">
              <h3 className="font-medium text-sm">등록한 이미지</h3>
              <img
                src={setting.profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border"
              />
            </div>
          )}

          {imageType === 'favicon' && setting.faviconUrl && (
            <div className="my-1">
              <h3 className="font-medium text-sm">파비콘</h3>
              <img
                src={setting.faviconUrl}
                alt="Favicon"
                className="w-16 h-16 object-cover"
              />
            </div>
          )}

          {imageType === 'banner' && setting.bannerUrl && (
            <div className="my-1">
              <h3 className="font-medium text-sm">배너 이미지</h3>
              <img
                src={setting.bannerUrl}
                alt="Banner"
                className="w-16 h-16 object-cover"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default SettingsDisplay;
