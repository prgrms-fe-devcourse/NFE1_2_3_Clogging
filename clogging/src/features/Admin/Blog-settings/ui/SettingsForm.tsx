'use client';

import React, { useState, useEffect } from 'react';
import SettingTextField from './SettingTextField';
import ProfileImageField from './ProfileImageField';
import FaviconImageField from './FaviconImageField';
import BannerImageField from './bannerImageField';
import { useTheme } from '@/shared/providers/theme';
import { Button } from '@/shared/ui/common/Button';

import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/shared/lib/firebase';

interface BlogSettings {
  profileImage: File | null;
  nickname: string;
  description: string;
  faviconImage: File | null;
  bannerImage: File | null;
  profileImageUrl?: string; // Add optional URL fields
  faviconUrl?: string;
  bannerUrl?: string;
}

export default function SettingsForm() {
  const { isDarkMode } = useTheme();
  const [settings, setSettings] = useState<BlogSettings>({
    profileImage: null,
    nickname: '',
    description: '',
    faviconImage: null,
    bannerImage: null,
    profileImageUrl: '', // Initialize URL fields
    faviconUrl: '',
    bannerUrl: '',
  });

  // Fetch existing settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      const settingsRef = collection(db, 'settings');
      const snapshot = await getDocs(settingsRef);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setSettings({
          profileImage: null,
          nickname: data.nickname || '',
          description: data.description || '',
          faviconImage: null,
          bannerImage: null,
          profileImageUrl: data.profileImageUrl || '', // Set URL fields
          faviconUrl: data.faviconUrl || '',
          bannerUrl: data.bannerUrl || '',
        });
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name: string, file: File | null) => {
    setSettings((prev) => ({ ...prev, [name]: file }));
  };

  const handleFileDelete = (name: string) => {
    setSettings((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Fetch the first document ID to update
      const settingsRef = collection(db, 'settings');
      const snapshot = await getDocs(settingsRef);
      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id; // Get the ID of the first document

        // Prepare URLs for images
        const profileImageUrl = settings.profileImage
          ? await uploadFile('settings/profileImages', settings.profileImage)
          : settings.profileImageUrl; // Use existing URL if no new image
        const faviconUrl = settings.faviconImage
          ? await uploadFile('settings/favicons', settings.faviconImage)
          : settings.faviconUrl; // Use existing URL if no new image
        const bannerUrl = settings.bannerImage
          ? await uploadFile('settings/banners', settings.bannerImage)
          : settings.bannerUrl; // Use existing URL if no new image

        // Update settings data in Firestore
        await updateDoc(doc(db, 'settings', docId), {
          nickname: settings.nickname,
          description: settings.description,
          profileImageUrl,
          faviconUrl,
          bannerUrl,
        });

        alert('설정이 저장되었습니다.');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('설정 저장 중 오류가 발생했습니다.');
    }
  };

  const uploadFile = async (path: string, file: File): Promise<string> => {
    const storageRef = ref(storage, `${path}/${file.name}`);
    await uploadBytes(storageRef, file);
    return storageRef.fullPath; // Return the path of the uploaded image
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
        file={
          settings.profileImage ||
          (settings.profileImageUrl
            ? new File([], settings.profileImageUrl)
            : null)
        } // Pass existing image or new file
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
        <div className={itemTitleStyle}>파비콘</div>
        <FaviconImageField
          label="파비콘"
          name="faviconImage" // Ensure this matches your state property
          file={
            settings.faviconImage ||
            (settings.faviconUrl ? new File([], settings.faviconUrl) : null)
          } // Pass existing image or new file
          onChange={handleFileChange} // Handle change in parent component
        />
        <div className={itemTitleStyle}>배너</div>
        <BannerImageField
          label="배너"
          name="bannerImage"
          file={
            settings.bannerImage ||
            (settings.bannerUrl ? new File([], settings.bannerUrl) : null)
          } // Pass existing image or new file
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
