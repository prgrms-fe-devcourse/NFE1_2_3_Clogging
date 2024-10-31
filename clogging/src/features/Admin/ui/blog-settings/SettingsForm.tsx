'use client';

import React, { useState } from 'react';
import SettingTextField from './SettingTextField';
import ProfileImageField from './ProfileImageField';
import FaviconImageField from './FaviconImageField';
import BannerImageField from './bannerImageField';
import { useTheme } from '@/shared/providers/theme';
import { Button } from '@/shared/ui/common/Button';

interface BlogSettings {
  profileImage: File | null;
  nickname: string;
  description: string;
  favicon: File | null;
  bannerImage: File | null;
}

export default function SettingsForm() {
  const { isDarkMode } = useTheme();
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

  const handleFileDelete = (name: string) => {
    setSettings((prev) => ({ ...prev, [name]: null }));
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

  const itemTitleStyle = `mb-3 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`;

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-4 rounded-md ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
    >
      <div className={itemTitleStyle}>프로필 사진</div>
      <ProfileImageField
        label="프로필 사진"
        name="profileImage"
        file={settings.profileImage}
        onChange={handleFileChange}
        onDelete={handleFileDelete}
      />
      <div className="mb-10">
        <SettingTextField
          label="블로그 닉네임"
          name="nickname"
          value={settings.nickname}
          onChange={handleInputChange}
          onBlur={(value) => handleInputChange('nickname', value)}
          maxLength={20}
          placeholder="닉네임을 20자 이내로 입력하세요"
        />
        <SettingTextField
          label="블로그 설명"
          name="description"
          value={settings.description}
          onChange={handleInputChange}
          onBlur={(value) => handleInputChange('description', value)}
          multiline
          maxLength={50}
          placeholder="설명을 50자 이내로 입력하세요"
        />
      </div>
      <div className="mb-10">
        {' '}
        <div className={itemTitleStyle}>파비콘</div>
        <FaviconImageField
          label="파비콘"
          name="favicon"
          file={settings.favicon}
          onChange={handleFileChange}
        />
        <div className={itemTitleStyle}>배너</div>
        <BannerImageField
          label="배너"
          name="bannerImage"
          file={settings.bannerImage}
          onChange={handleFileChange}
        />
      </div>
      <div className="mb-4 flex justify-end ">
        <Button type="submit" className="rounded-full">
          저장하기
        </Button>
      </div>
    </form>
  );
}
