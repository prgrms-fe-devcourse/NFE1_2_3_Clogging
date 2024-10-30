import React, { useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui/common/Button';
import { useTheme } from '@/shared/providers/theme';

interface BannerImageFieldProps {
  label: string;
  name: string;
  file: File | null;
  onChange: (name: string, file: File | null) => void;
}

export default function BannerImageField({
  label,
  name,
  file,
  onChange,
}: BannerImageFieldProps) {
  const { isDarkMode } = useTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onChange(name, file);
      } else {
        alert('이미지 파일만 선택할 수 있습니다.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleRemove = () => {
    onChange(name, null);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between border border-gray-300 rounded-lg p-4">
        {/* 이미지 미리보기 영역 */}
        <div
          className="border-2 border-dashed border-gray-500 rounded-full p-2 cursor-pointer flex items-center justify-center"
          style={{ width: '64px', height: '64px' }}
          onClick={() => fileInputRef.current?.click()}
        >
          {file ? (
            <Image
              src={URL.createObjectURL(file)}
              alt={`${label} Preview`}
              width={64}
              height={64}
              className="object-cover w-full h-full rounded-full"
            />
          ) : (
            <span className="text-2xl text-gray-400">+</span>
          )}
        </div>

        {/* 텍스트 영역 */}
        <div className="flex-grow mx-4">
          <p
            className={`mb-2 text-sm  ${isDarkMode ? 'text-white' : 'text-[#2B3674]'}`}
          >
            메인 배너 : {file ? file.name : '선택된 파일 없음'}
          </p>
          <p className="text-xs text-gray-500">
            최적 사이즈 1600 x 500 / 파일 형식 JPG, PNG{' '}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            id={name}
            name={name}
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          <Button
            type="button"
            className="rounded-full text-xs"
            onClick={() => fileInputRef.current?.click()}
          >
            파일 선택
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full text-xs"
            onClick={handleRemove}
            disabled={!file}
          >
            이미지 제거
          </Button>
        </div>
      </div>
    </div>
  );
}
