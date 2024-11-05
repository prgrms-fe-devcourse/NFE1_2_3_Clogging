import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui/common/Button';
import { useTheme } from '@/shared/providers/theme';

interface ProfileImageFieldProps {
  label: string;
  name: string;
  file: File | null;
  onChange: (name: string, file: File | null, url: string) => void;
  onDelete: (type: string) => void;
  previewUrl?: string;
}

export default function ProfileImageField({
  label,
  name,
  file,
  onChange,
  onDelete,
  previewUrl,
}: ProfileImageFieldProps) {
  const { isDarkMode } = useTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState(previewUrl);

  useEffect(() => {
    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      setLocalPreviewUrl(newPreviewUrl);
      return () => URL.revokeObjectURL(newPreviewUrl);
    } else {
      setLocalPreviewUrl(previewUrl);
    }
  }, [file, previewUrl]);

  const getFileSize = (file: File | null) => {
    if (file) {
      const sizeInKB = (file.size / 1024).toFixed(2);
      return `${sizeInKB} KB`;
    }
    return '0 KB';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(name, e.target.files[0], 'profileImageUrl');
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex items-end justify-center">
        <div className="">
          <div
            className={`relative w-[120px] h-[120px] border rounded-full overflow-hidden mr-4 ${
              isDarkMode ? 'border-gray-600' : 'border-gray-300'
            }`}
          >
            {localPreviewUrl ? (
              <Image
                src={localPreviewUrl}
                alt={`${label} Preview`}
                width={120}
                height={120}
                className="object-cover w-full h-full"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                }`}
              >
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>
        </div>

        <input
          type="file"
          id={name}
          name={name}
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <div className="flex justify-center space-x-4"></div>
        {localPreviewUrl ? (
          <>
            <Button
              variant="outline"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs rounded-full text-gray-700 mr-1"
            >
              수정
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                onDelete('profileImageUrl');
                setLocalPreviewUrl('');
              }}
              className="text-xs rounded-full text-gray-700"
            >
              삭제
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs rounded-full text-gray-700"
          >
            이미지 등록
          </Button>
        )}
      </div>

      {file && (
        <div
          className={`text-center mt-2 text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          새로 등록한 이미지: {getFileSize(file)}
        </div>
      )}
    </div>
  );
}
