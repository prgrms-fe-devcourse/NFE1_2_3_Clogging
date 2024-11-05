import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui/common/Button';
import { useTheme } from '@/shared/providers/theme';
import { ImageFieldProps } from './ProfileImageField';
import { imageFieldStyle } from './FaviconImageField';

export default function BannerImageField({
  label,
  name,
  file,
  previewUrl,
  onChange,
  onDelete,
  defaultImage,
}: ImageFieldProps) {
  const { isDarkMode } = useTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState(
    previewUrl || defaultImage,
  );
  useEffect(() => {
    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      setLocalPreviewUrl(newPreviewUrl);
      return () => URL.revokeObjectURL(newPreviewUrl);
    } else {
      setLocalPreviewUrl(previewUrl || defaultImage);
    }
  }, [file, previewUrl, defaultImage]);

  // 파일 변경 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(name, e.target.files[0], name);
    }
  };

  const handleRomoveImage = () => {
    onDelete();
    setLocalPreviewUrl(defaultImage);
  };

  return (
    <div className="mb-4">
      <div
        className={`flex flex-col pr-4 sm:flex-row items-center border rounded-lg overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
      >
        {/* 이미지 미리보기 영역 */}
        <div className="flex items-center justify-center">
          <div
            className={`${imageFieldStyle} ${file ? 'border border-gray-300' : 'border-2 border-dashed'} ${isDarkMode ? 'bg-gray-200' : 'bg-white'}`}
            onClick={() => fileInputRef.current?.click()} // 클릭 시 파일 선택
          >
            {localPreviewUrl !== defaultImage ? (
              <Image
                src={localPreviewUrl} // 미리보기를 위한 객체 URL 생성
                alt={`${label} Preview`}
                width={60}
                height={60}
                className={`w-[90%] h-auto`}
              />
            ) : (
              <span className="text-2xl text-gray-400">+</span>
            )}
          </div>
        </div>

        {/* 텍스트 및 버튼 영역 */}
        <div className="flex-grow flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
          <div className="mb-4 sm:mb-0 sm:mr-4">
            <div
              className={` mb-2 text-sm overflow-hidden ${isDarkMode ? 'text-white' : 'text-[#2B3674]'} truncate overflow-hidden`}
            >
              메인 배너
              <div className="text-xs truncate overflow-hidden">
                {file ? file.name : ''}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              최적 사이즈 1600 x 500 / 파일 형식 JPG, PNG
            </p>
          </div>
          <div className="flex space-x-2 mt-2">
            <input
              ref={fileInputRef}
              type="file"
              id={name}
              name={name}
              accept="image/*"
              onChange={handleFileChange} // 파일 변경 시 핸들러 호출
              className="hidden"
            />
            <Button
              type="button"
              className="rounded-full text-xs"
              onClick={() => fileInputRef.current?.click()} // 버튼 클릭 시 파일 선택
            >
              파일 변경
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full text-xs"
              onClick={handleRomoveImage} // 제거 버튼 클릭 시 핸들러 호출
            >
              제거
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
