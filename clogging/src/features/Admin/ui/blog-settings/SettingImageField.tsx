import React from 'react';
import Image from 'next/image';

interface SettingImageFieldProps {
  label: string;
  name: string;
  file: File | null;
  onChange: (name: string, file: File | null) => void;
  type: 'profile' | 'favicon' | 'banner'; // 타입 추가
}

export default function SettingImageField({
  label,
  name,
  file,
  onChange,
  type,
}: SettingImageFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onChange(name, files[0]);
    }
  };

  // 스타일 클래스 정의
  const containerClasses = {
    profile: 'border-2 border-solid border-gray-300 rounded-lg',
    favicon: 'border-2 border-dashed border-gray-500 rounded-full',
    banner: 'border-2 border-dotted border-gray-400 rounded-md',
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-2 font-bold">
        {label}
      </label>
      <input
        type="file"
        id={name}
        name={name}
        accept="image/*"
        onChange={handleChange}
        className="hidden" // 파일 입력을 숨김
      />
      <div
        className={`p-4 cursor-pointer flex items-center justify-center ${containerClasses[type]}`}
        onClick={() => document.getElementById(name)?.click()} // 클릭 시 파일 입력 클릭
      >
        {file ? (
          <Image
            src={URL.createObjectURL(file)} // 선택된 이미지 미리보기
            alt={`${label} Preview`}
            width={200}
            height={200}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            <span className="text-4xl">+</span> {/* 플러스 아이콘 */}
          </div>
        )}
      </div>
    </div>
  );
}
