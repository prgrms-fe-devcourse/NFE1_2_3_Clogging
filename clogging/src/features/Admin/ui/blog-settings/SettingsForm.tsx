'use client';
import React, { useState, useEffect } from 'react';
import SettingTextField from './SettingTextField';
import ProfileImageField from './ProfileImageField';
import FaviconImageField from './FaviconImageField';
import { useTheme } from '@/shared/providers/theme';
import { Button } from '@/shared/ui/common/Button';
import { settingsImageUploadImage } from './utils/settingsImageUpload'; // 경로 확인 필요
import BannerImageField from './bannerImageField';

interface BlogSettings {
  id?: string;
  profileImage: File[] | null;
  nickname: string;
  description: string;
  faviconImage: File[] | null;
  bannerImage: string[] | null;
}

export default function SettingsForm() {
  const { isDarkMode } = useTheme();
  const [settings, setSettings] = useState<BlogSettings>({
    profileImage: null,
    nickname: '',
    description: '',
    faviconImage: null,
    bannerImage: null,
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const fetchedSettings = data[0];
          setSettings({
            ...fetchedSettings,
            profileImage: fetchedSettings.profileImage || [],
            faviconImage: fetchedSettings.faviconImage || [],
            bannerImage: fetchedSettings.bannerImage || [],
          });
          setExistingImages([
            ...(fetchedSettings.profileImage || []),
            ...(fetchedSettings.faviconImage || []),
            ...(fetchedSettings.bannerImage || []),
          ]);
        }
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name: string, file: File | null) => {
    if (file) {
      setSettings((prev) => ({
        ...prev,
        [name]: [...(prev[name] || []), file.name], // 파일 이름을 배열에 추가
      }));
    } else {
      setSettings((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileDelete = (name: string, imagePath?: string) => {
    if (imagePath) {
      setImagesToDelete((prev) => [...prev, imagePath]);
    }
    setSettings((prev) => ({
      ...prev,
      [name]: prev[name]?.filter((img) => img !== imagePath), // 해당 이미지 제거
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // 이미지 업로드 처리 및 settings ID 전달
      await Promise.all(
        Object.entries(settings).map(async ([key, value]) => {
          if (value && Array.isArray(value)) {
            for (const file of value) {
              await settingsImageUploadImage(file); // 이미지 업로드 함수 호출
            }
          }
        }),
      );

      // 서버에 보낼 데이터 준비
      const formData = {
        id: settings.id,
        nickname: settings.nickname,
        description: settings.description,
        profileImage: settings.profileImage || [],
        faviconImage: settings.faviconImage || [],
        bannerImage: settings.bannerImage || [],
      };

      // PUT 요청으로 설정 업데이트
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('설정이 업데이트되었습니다.');
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('설정 업데이트 중 오류가 발생했습니다.');
    }
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
        file={settings.profileImage?.[0] || null}
        onChange={handleFileChange}
        onDelete={(filePath) => handleFileDelete('profileImage', filePath)}
      />

      <div className="mb-10">
        <SettingTextField
          label="블로그 닉네임"
          name="nickname"
          value={settings.nickname}
          onChange={handleInputChange}
          onBlur={(value) => handleInputChange('nickname', value)}
          maxLength={20}
          placeholder="닉네임을 입력하세요"
        />

        <SettingTextField
          label="블로그 설명"
          name="description"
          value={settings.description}
          onChange={handleInputChange}
          onBlur={(value) => handleInputChange('description', value)}
          multiline
          maxLength={50}
          placeholder="설명을 입력하세요"
        />
      </div>

      <div className="mb-10">
        <div className={itemTitleStyle}>파비콘</div>
        <FaviconImageField
          label="파비콘"
          name="favicon"
          file={settings.faviconImage?.[0] || null}
          onChange={handleFileChange}
        />

        <div className={itemTitleStyle}>배너</div>
        <BannerImageField
          label="배너"
          name="bannerImage"
          file={settings.bannerImage?.[0] || null}
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
