'use client';

import React, { useState } from 'react';
import { useTheme } from '@/shared/providers/theme';
import { SettingPassword } from '@/features/Admin/Blog-settings/ui/SettingPassword';

interface BlogSettings {
  profileImage: File | null;
  nickname: string;
  description: string;
  favicon: File | null;
  bannerImage: File | null;
}

export default function adminSettingPage() {
  const { isDarkMode } = useTheme();
  const [settings, setSettings] = useState<BlogSettings>({
    profileImage: null,
    nickname: '',
    description: '',
    favicon: null,
    bannerImage: null,
  });

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
    <form
      onSubmit={handleSubmit}
      className={`p-4 rounded-md ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
    >
      <div className="mb-10">
        <SettingPassword />
      </div>
    </form>
  );
}
