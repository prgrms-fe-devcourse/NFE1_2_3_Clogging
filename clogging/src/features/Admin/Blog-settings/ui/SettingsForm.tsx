'use client';
import React, { useEffect, useState } from 'react';
import ProfileImageField from './ProfileImageField';
import FaviconImageField from './FaviconImageField';
import SettingTextField from './SettingTextField';
import { Button } from '@/shared/ui/common/Button';
import { useTheme } from '@/shared/providers/theme';
import { useFetchSettings } from '../hooks/useFetchSettings'; // 설정을 가져오는 훅
import { useUploadImages } from '../hooks/useUploadImages'; // 이미지를 업로드하는 훅
import BannerImageField from './bannerImageField';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

interface BlogSettings {
  profileImage: File | null;
  faviconImage: File | null;
  bannerImage: File | null;
  title: string;
  description: string;
  profileImageUrl?: string;
  faviconUrl?: string;
  bannerUrl?: string;
}

export default function SettingsForm() {
  const { isDarkMode } = useTheme(); // 다크 모드 여부 확인
  const { settingsId, settingsData } = useFetchSettings(); // 설정을 가져옴
  const { uploadFile } = useUploadImages(); // 이미지 업로드 함수

  const [settings, setSettings] = useState<BlogSettings>({
    profileImage: null,
    faviconImage: null,
    bannerImage: null,
    title: '',
    description: '',
    profileImageUrl: '',
    faviconUrl: '',
    bannerUrl: '',
  });

  // 설정 데이터를 가져온 후 상태 업데이트
  useEffect(() => {
    if (settingsData) {
      setSettings((prev) => ({
        ...prev,
        title: settingsData.title || '',
        description: settingsData.description || '',
        profileImageUrl: settingsData.profileImageUrl || '',
        faviconUrl: settingsData.faviconUrl || '',
        bannerUrl: settingsData.bannerUrl || '',
      }));
    }
  }, [settingsData]);

  // 파일 변경 핸들러
  const handleFileChange = (name: string, file: File | null) => {
    setSettings((prev) => ({ ...prev, [name]: file }));
  };

  // 텍스트 필드 변경 핸들러
  const handleChange = (name: string, value: string) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 기본 제출 이벤트 방지

    // 이미지 URL을 저장할 변수
    let profileImageUrl = settings.profileImageUrl; // 기존 URL로 초기화
    let faviconUrl = settings.faviconUrl; // 기존 URL로 초기화
    let bannerUrl = settings.bannerUrl; // 기존 URL로 초기화

    try {
      // 프로필 이미지가 변경된 경우에만 업로드
      if (settings.profileImage) {
        profileImageUrl = await uploadFile(
          settings.profileImage,
          `settings/profileImages/${settingsId}`, // 경로 수정
        );
      }

      // 파비콘 이미지가 변경된 경우에만 업로드
      if (settings.faviconImage) {
        faviconUrl = await uploadFile(
          settings.faviconImage,
          `settings/favicons/${settingsId}`, // 경로 수정
        );
      }

      // 배너 이미지가 변경된 경우에만 업로드
      if (settings.bannerImage) {
        bannerUrl = await uploadFile(
          settings.bannerImage,
          `settings/banners/${settingsId}`, // 경로 수정
        );
      }

      // 저장할 데이터 준비
      const updatedSettings = {
        title: settings.title,
        description: settings.description,
        profileImageUrl,
        faviconUrl,
        bannerUrl,
      };

      // Firestore에 업데이트된 설정 저장
      if (settingsId) {
        await setDoc(doc(db, 'settings', settingsId), updatedSettings);

        // 로컬 상태 업데이트
        setSettings((prev) => ({
          ...prev,
          profileImageUrl,
          faviconUrl,
          bannerUrl,
        }));

        alert('설정이 저장되었습니다.'); // 저장 완료 알림
        // 페이지 새로고침
        window.location.reload(); // 페이지 새로고침
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('설정 저장 중 오류가 발생했습니다.'); // 오류 알림
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-4 rounded-md ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
    >
      <h2 className="text-lg font-semibold mb-4">설정</h2>

      <ProfileImageField
        label="프로필 사진"
        name="profileImage"
        file={settings.profileImage}
        onChange={handleFileChange}
      />

      <SettingTextField
        label="제목"
        name="title"
        value={settings.title}
        onChange={handleChange}
        maxLength={50}
        placeholder="블로그 제목을 입력하세요."
      />

      <SettingTextField
        label="설명"
        name="description"
        value={settings.description}
        onChange={handleChange}
        multiline
        maxLength={200}
        placeholder="블로그 설명을 입력하세요."
      />

      <FaviconImageField
        label="파비콘"
        name="faviconImage"
        file={settings.faviconImage}
        onChange={handleFileChange}
      />

      <BannerImageField
        label="배너 이미지"
        name="bannerImage"
        file={settings.bannerImage}
        onChange={handleFileChange}
      />

      <div className="mt-4 flex justify-end">
        <Button type="submit" className="rounded-full">
          저장하기
        </Button>
      </div>
    </form>
  );
}
