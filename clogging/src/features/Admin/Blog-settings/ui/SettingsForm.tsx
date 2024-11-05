'use client';
import React, { useEffect } from 'react';
import ProfileImageField from './ProfileImageField';
import FaviconImageField from './FaviconImageField';
import SettingTextField from './SettingTextField';
import { Button } from '@/shared/ui/common/Button';
import { useTheme } from '@/shared/providers/theme';
import { useFetchSettings } from '../hooks/useFetchSettings';
import { useUploadImages } from '../hooks/useUploadImages';
import BannerImageField from './bannerImageField';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useImageHandling } from '../hooks/useImageHandling';
import { BlogSettings } from '../types';
import { DEFAULT_IMAGES } from '../constants';

export default function SettingsForm() {
  const { isDarkMode } = useTheme();
  const { settingsId, settingsData } = useFetchSettings();
  const { uploadFile } = useUploadImages();

  const initialSettings: BlogSettings = {
    profileImage: null,
    faviconImage: null,
    bannerImage: null,
    title: '',
    description: '',
    profileImageUrl: '',
    faviconUrl: '',
    bannerUrl: '',
  };

  const { settings, setSettings, handleFileChange, handleDelete } =
    useImageHandling(initialSettings);

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
  }, [settingsData, setSettings]);

  const handleChange = (name: string, value: string) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const updatedSettings = await saveSettings(
        settings,
        settingsId,
        uploadFile,
      );
      setSettings((prev) => ({ ...prev, ...updatedSettings }));
      alert('설정이 저장되었습니다.');
      window.location.reload();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('설정 저장 중 오류가 발생했습니다.');
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
        previewUrl={settings.profileImageUrl}
        onDelete={() => handleDelete('profileImage')}
        defaultImage={DEFAULT_IMAGES.profileImage}
      />

      <SettingTextField
        label="블로그 닉네임"
        name="title"
        value={settings.title}
        onChange={handleChange}
        maxLength={20}
        placeholder="닉네임을 입력하세요."
      />

      <SettingTextField
        label="블로그 설명"
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
        onDelete={() => handleDelete('favicon')}
        previewUrl={settings.faviconUrl}
        defaultImage={DEFAULT_IMAGES.favicon}
      />

      <BannerImageField
        label="배너 이미지"
        name="bannerImage"
        file={settings.bannerImage}
        onChange={handleFileChange}
        previewUrl={settings.bannerUrl}
        onDelete={() => handleDelete('banner')}
        defaultImage={DEFAULT_IMAGES.banner}
      />

      <div className="mt-4 flex justify-end">
        <Button type="submit" className="rounded-full text-sm">
          저장하기
        </Button>
      </div>
    </form>
  );
}

async function saveSettings(
  settings: BlogSettings,
  settingsId: string | undefined,
  uploadFile: (file: File, path: string) => Promise<string>,
) {
  let profileImageUrl = settings.profileImageUrl;
  let faviconUrl = settings.faviconUrl;
  let bannerUrl = settings.bannerUrl;

  if (settings.profileImage) {
    profileImageUrl = await uploadFile(
      settings.profileImage,
      `settings/profileImages/${settingsId}`,
    );
  }

  if (settings.faviconImage) {
    faviconUrl = await uploadFile(
      settings.faviconImage,
      `settings/favicons/${settingsId}`,
    );
  }

  if (settings.bannerImage) {
    bannerUrl = await uploadFile(
      settings.bannerImage,
      `settings/banners/${settingsId}`,
    );
  }

  const updatedSettings = {
    title: settings.title,
    description: settings.description,
    profileImageUrl,
    faviconUrl,
    bannerUrl,
  };

  if (settingsId) {
    await setDoc(doc(db, 'settings', settingsId), updatedSettings);
  }

  return updatedSettings;
}
