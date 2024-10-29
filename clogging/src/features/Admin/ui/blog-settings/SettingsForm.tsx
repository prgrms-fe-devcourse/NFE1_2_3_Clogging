'use client';

import React, { useState } from 'react';
import Image from 'next/image';

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setSettings((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 서버 API 대신 콘솔에 데이터 출력
    console.log('저장된 설정:', {
      ...settings,
      profileImage: settings.profileImage ? settings.profileImage.name : null,
      favicon: settings.favicon ? settings.favicon.name : null,
      bannerImage: settings.bannerImage ? settings.bannerImage.name : null,
    });

    // 저장 완료 알림
    alert('설정이 저장되었습니다. (콘솔에서 저장된 데이터를 확인하세요)');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="profileImage">프로필 사진</label>
        <input
          type="file"
          id="profileImage"
          name="profileImage"
          accept="image/*"
          onChange={handleFileChange}
        />
        {settings.profileImage && (
          <Image
            src={URL.createObjectURL(settings.profileImage)}
            alt="Profile Preview"
            width={100}
            height={100}
          />
        )}
      </div>

      <div>
        <label htmlFor="nickname">블로그 닉네임</label>
        <input
          type="text"
          id="nickname"
          name="nickname"
          value={settings.nickname}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="description">블로그 설명</label>
        <textarea
          id="description"
          name="description"
          value={settings.description}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="favicon">파비콘</label>
        <input
          type="file"
          id="favicon"
          name="favicon"
          accept="image/*"
          onChange={handleFileChange}
        />
        {settings.favicon && (
          <Image
            src={URL.createObjectURL(settings.favicon)}
            alt="Favicon Preview"
            width={32}
            height={32}
          />
        )}
      </div>

      <div>
        <label htmlFor="bannerImage">배너 이미지</label>
        <input
          type="file"
          id="bannerImage"
          name="bannerImage"
          accept="image/*"
          onChange={handleFileChange}
        />
        {settings.bannerImage && (
          <Image
            src={URL.createObjectURL(settings.bannerImage)}
            alt="Banner Preview"
            width={200}
            height={100}
          />
        )}
      </div>

      <button type="submit">저장하기</button>
    </form>
  );
}
