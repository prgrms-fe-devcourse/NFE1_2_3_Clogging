import { BlogSettings } from '../types';

export const fetchSettings = async (): Promise<BlogSettings | null> => {
  const response = await fetch('/api/settings');
  if (response.ok) {
    const data = await response.json();
    if (data.length > 0) {
      return {
        ...data[0],
        profileImage: data[0].profileImage || [],
        faviconImage: data[0].faviconImage || [],
        bannerImage: data[0].bannerImage || [],
      };
    }
  }
  return null;
};

export const updateSettings = async (settings: BlogSettings): Promise<void> => {
  const response = await fetch('/api/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error('Failed to update settings');
  }
};

export const uploadSettingsImage = async (file: File): Promise<void> => {
  // 이미지 업로드 로직 구현
};
