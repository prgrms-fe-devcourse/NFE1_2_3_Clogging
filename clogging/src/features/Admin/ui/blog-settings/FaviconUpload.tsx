import React, { useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui/common/Button';

interface FaviconUploadProps {
  label: string;
  name: string;
  file: File | null;
  onChange: (name: string, file: File | null) => void;
}

export default function FaviconUpload({
  label,
  name,
  file,
  onChange,
}: FaviconUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null); // ref 생성

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onChange(name, files[0]);
    }
  };

  const handleRemove = () => {
    onChange(name, null); // 파일 제거
  };

  return (
    <div className="">
      <label htmlFor={name} className="block mb-2 font-bold">
        {label}
      </label>
      <div className="flex items-center mb-4 border border-gray-300 rounded-lg p-4">
        <input
          type="file"
          id={name}
          name={name}
          accept=".ico"
          onChange={handleChange}
          className="hidden"
          ref={fileInputRef} // ref 연결
        />

        {/* 이미지 미리보기 영역 */}
        <div
          className="border-2 border-dashed border-gray-500 rounded-full p-2 cursor-pointer flex items-center justify-center mr-4"
          style={{ width: '64px', height: '64px' }} // 고정된 크기
          onClick={() => fileInputRef.current?.click()} // ref를 통해 클릭
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

        {/* 버튼 영역 */}
        <div className="flex space-x-2">
          <Button
            type="button"
            className="rounded-full"
            onClick={() => fileInputRef.current?.click()} // ref를 통해 클릭
          >
            파일 선택
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={handleRemove} // 이미지 제거 버튼
            disabled={!file} // 이미지가 없을 때 비활성화
          >
            이미지 제거
          </Button>
        </div>
      </div>
    </div>
  );
}
