import React, { useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui/common/Button';
import { useTheme } from '@/shared/providers/theme';
import SettingsDisplay from './SettingsDisplay';

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

  // 파일 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onChange(name, file); // 이미지 파일이면 onChange 호출
      } else {
        alert('이미지 파일만 선택할 수 있습니다.'); // 이미지가 아닐 경우 경고
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // 입력값 초기화
        }
      }
    }
  };

  // 파일 제거 핸들러
  const handleRemove = () => {
    onChange(name, null); // 파일 제거 시 null로 설정
  };

  return (
    <div className="mb-4">
      <div
        className={`flex flex-col sm:flex-row items-center border rounded-lg overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
      >
        {/* 이미지 미리보기 영역 */}
        <div className="w-full sm:w-1/4 bg-gray-200 p-4 flex items-center justify-center">
          <div
            className={`cursor-pointer flex items-center justify-center overflow-hidden rounded-md
            ${file ? 'border border-gray-300' : 'border-2 border-dashed border-gray-500'}`}
            onClick={() => fileInputRef.current?.click()} // 클릭 시 파일 선택
          >
            {file ? (
              <Image
                src={URL.createObjectURL(file)} // 미리보기를 위한 객체 URL 생성
                alt={`${label} Preview`}
                width={160}
                height={500}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-4xl text-gray-400">+</span>
            )}
          </div>
        </div>

        {/* 선택적 설정 표시 */}
        <SettingsDisplay imageType="banner" />

        {/* 텍스트 및 버튼 영역 */}
        <div className="flex-grow p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
          <div className="mb-4 sm:mb-0 sm:mr-4">
            <p
              className={`mb-2 text-sm ${isDarkMode ? 'text-white' : 'text-[#2B3674]'}`}
            >
              메인 배너 : {file ? file.name : '선택된 파일 없음'}
            </p>
            <p className="text-xs text-gray-500">
              최적 사이즈 1600 x 500 / 파일 형식 JPG, PNG
            </p>
          </div>

          <div className="flex space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              id={name}
              name={name}
              accept="image/*" // 모든 이미지 형식 허용
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
