import React, { useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui/common/Button';
import { useTheme } from '@/shared/providers/theme';
import SettingsDisplay from './SettingsDisplay';

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

  // 파일 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onChange(name, files[0]); // 파일이 선택되면 onChange 호출
    } else {
      onChange(name, null); // 파일이 선택되지 않았을 때 null로 설정
    }
  };

  // 파일 제거 핸들러
  const handleRemove = () => {
    onChange(name, null); // 파일 제거 시 null로 설정
  };

  return (
    <div className="mb-4">
      <div
        className={`flex items-center border rounded-lg p-4 overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
      >
        {/* 이미지 미리보기 영역 */}
        <div className="bg-gray-200 flex items-center justify-center">
          <div
            className={`w-20 h-20 cursor-pointer flex items-center justify-center overflow-hidden rounded-full
            ${file ? 'border border-gray-300' : 'border-2 border-dashed border-gray-500'}`}
            onClick={() => fileInputRef.current?.click()} // 클릭 시 파일 선택
          >
            {file ? (
              <Image
                src={URL.createObjectURL(file)} // 미리보기를 위한 객체 URL 생성
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

        {/* 선택적 설정 표시 */}
        <SettingsDisplay imageType="favicon" />

        {/* 텍스트 및 버튼 영역 */}
        <div className="flex justify-between flex-grow">
          <div>
            <p
              className={`mb-2 text-sm ${isDarkMode ? 'text-white' : 'text-[#2B3674]'}`}
            >
              파비콘 : {file ? file.name : '선택된 파일 없음'}
            </p>
            <p className="text-xs text-gray-500">파일 형식 ICO</p>
          </div>
          <div className="flex space-x-2 mt-2">
            <input
              ref={fileInputRef}
              type="file"
              id={name}
              name={name}
              accept=".ico" // ICO 파일만 선택 가능
              onChange={handleChange} // 파일 변경 시 핸들러 호출
              className="hidden"
            />
            <Button
              type="button"
              className="rounded-full text-xs"
              onClick={() => fileInputRef.current?.click()} // 버튼 클릭 시 파일 선택
            >
              파일 선택
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full text-xs"
              onClick={handleRemove} // 제거 버튼 클릭 시 핸들러 호출
              disabled={!file} // 파일이 없으면 비활성화
            >
              이미지 제거
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
