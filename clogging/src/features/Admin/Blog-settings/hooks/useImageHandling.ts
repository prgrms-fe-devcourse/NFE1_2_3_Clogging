import { useState } from 'react';
import { BlogSettings } from '../types';
import { DEFAULT_IMAGES } from '../constants';

export const useImageHandling = (initialSettings: BlogSettings) => {
  const [settings, setSettings] = useState<BlogSettings>(initialSettings);

  const handleFileChange = (name: string, file: File | null, url: string) => {
    setSettings((prev) => ({
      ...prev,
      [name]: file,
      [url]: prev[url as keyof BlogSettings],
    }));
  };

  const handleDelete = (type: 'profileImage' | 'favicon' | 'banner') => {
    setSettings((prev) => ({
      ...prev,
      [type + 'Url']: DEFAULT_IMAGES[type],
    }));
  };

  return { settings, setSettings, handleFileChange, handleDelete };
};
