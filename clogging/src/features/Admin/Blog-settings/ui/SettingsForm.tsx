'use client';
import React, { useEffect, useState } from 'react';
import ProfileImageField from './ProfileImageField';
import FaviconImageField from './FaviconImageField';
import SettingTextField from './SettingTextField';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { storage, db } from '@/shared/lib/firebase';
import { Button } from '@/shared/ui/common/Button';
import { useTheme } from '@/shared/providers/theme';
import BannerImageField from './bannerImageField';

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
  const { isDarkMode } = useTheme();
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

  const [settingsId, setSettingsId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      // Fetch settings logic...
    };

    fetchSettings();
  }, []);

  const handleFileChange = (name: string, file: File | null) => {
    setSettings((prev) => ({ ...prev, [name]: file }));
  };

  const handleChange = (name: string, value: string) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Submit logic...
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
