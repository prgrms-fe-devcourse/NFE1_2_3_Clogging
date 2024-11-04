import React, { useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui/common/Button';
import { useTheme } from '@/shared/providers/theme';

interface ProfileImageFieldProps {
  label: string;
  name: string;
  file: File | null;
  onChange: (name: string, file: File | null) => void;
  onDelete: (name: string) => void; // 삭제 기능을 위한 prop 추가
}

export default function ProfileImageField({
  label,
  name,
  file,
  onChange,
  onDelete,
}: ProfileImageFieldProps) {
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

  return (
    <div className="mb-10">
      <div className="flex items-end justify-center">
        <div
          className={`relative w-[100px] h-[100px] border rounded-full overflow-hidden mr-4 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
        >
          {file ? (
            <Image
              src={URL.createObjectURL(file)}
              alt={`${label} Preview`}
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
            >
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
        <div>
          <input
            type="file"
            id={name}
            name={name}
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            ref={fileInputRef}
          />
          {file ? (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs rounded-full text-gray-700"
              >
                수정
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => onDelete(name)}
                className="text-xs rounded-full text-gray-700"
              >
                삭제
              </Button>
            </div>
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
      </div>
    </div>
  );
}
