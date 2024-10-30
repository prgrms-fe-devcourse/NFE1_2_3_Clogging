'use client';

import React, { useState } from 'react';
import SettingImageField from './SettingImageField';
import SettingTextField from './SettingTextField';
import ProfileImageUpload from './ProfileImageUpload';
import FaviconUpload from './FaviconUpload';
interface BlogSettings {
  profileImage: File | null;
  nickname: string;
  description: string;
  favicon: File | null;
  bannerImage: File | null;
}

export default function SettingsForm() {
  const [settings, setSettings] = useState<BlogSettings>({
    profileImage: null,
    nickname: '',
    description: '',
    favicon: null,
    bannerImage: null,
  });

  const handleInputChange = (name: string, value: string) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name: string, file: File | null) => {
    setSettings((prev) => ({ ...prev, [name]: file }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('저장된 설정:', {
      ...settings,
      profileImage: settings.profileImage ? settings.profileImage.name : null,
      favicon: settings.favicon ? settings.favicon.name : null,
      bannerImage: settings.bannerImage ? settings.bannerImage.name : null,
    });
    alert('설정이 저장되었습니다.');
  };

  return (
    <form onSubmit={handleSubmit}>
      <ProfileImageUpload
        label="프로필 사진"
        name="profileImage"
        file={settings.profileImage}
        onChange={handleFileChange}
      />

      <SettingTextField
        label="블로그 닉네임"
        name="nickname"
        value={settings.nickname}
        onChange={handleInputChange}
        onBlur={(value) => handleInputChange('nickname', value)}
      />

      <SettingTextField
        label="블로그 설명"
        name="description"
        value={settings.description}
        onChange={handleInputChange}
        onBlur={(value) => handleInputChange('description', value)}
        multiline
      />

      <FaviconUpload
        label="파비콘"
        name="favicon"
        file={settings.favicon}
        onChange={handleFileChange}
      />

      <SettingImageField
        label="배너 이미지"
        name="bannerImage"
        file={settings.bannerImage}
        onChange={handleFileChange}
        type="banner" // 배너 이미지 타입
      />
      <button type="submit">저장하기</button>
    </form>
  );
}
