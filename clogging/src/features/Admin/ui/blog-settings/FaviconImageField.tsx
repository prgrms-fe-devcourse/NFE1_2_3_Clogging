import React, { useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui/common/Button';
import { useTheme } from '@/shared/providers/theme';

interface FaviconImageFieldProps {
  label: string;
  name: string;
  file: File | null;
  onChange: (name: string, file: File | null) => void;
}

export default function FaviconImageField({
  label,
  name,
  file,
  onChange,
}: FaviconImageFieldProps) {
  const { isDarkMode } = useTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onChange(name, files[0]);
    }
  };

  const handleRemove = () => {
    onChange(name, null);
  };

  return (
    <div className="mb-4">
      <div className="flex flex-col sm:flex-row items-center border border-gray-300 rounded-lg overflow-hidden">
        {/* 이미지 미리보기 영역 */}
        <div className="w-full sm:w-1/4 bg-gray-200 p-4 flex items-center justify-center">
          <div
            className={`cursor-pointer flex items-center justify-center overflow-hidden rounded-full
            ${
              file
                ? 'border border-gray-300'
                : 'border-2 border-dashed border-gray-500'
            }`}
            style={{ width: '64px', height: '64px' }}
            onClick={() => fileInputRef.current?.click()}
          >
            {file ? (
              <Image
                src={URL.createObjectURL(file)}
                alt={`${label} Preview`}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-2xl text-gray-400">+</span>
            )}
          </div>
        </div>

        {/* 텍스트 및 버튼 영역 */}
        <div className="flex-grow p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
          <div className="mb-4 sm:mb-0 sm:mr-4">
            <p
              className={`mb-2 text-sm ${
                isDarkMode ? 'text-white' : 'text-[#2B3674]'
              }`}
            >
              파비콘 : {file ? file.name : '선택된 파일 없음'}
            </p>
            <p className="text-xs text-gray-500">파일 형식 ICO</p>
          </div>

          <div className="flex space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              id={name}
              name={name}
              accept=".ico"
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
    </div>
  );
}