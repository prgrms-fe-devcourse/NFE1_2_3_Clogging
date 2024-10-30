import React from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui/common/Button';

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onChange(name, files[0]);
    }
  };

  return (
    <div className="mb-10">
      <label htmlFor={name} className="block mb-2 font-bold">
        {label}
      </label>
      <div className="flex items-end justify-center">
        <div className="relative w-[100px] h-[100px] border border-gray-300 rounded-full overflow-hidden mr-4">
          {file ? (
            <Image
              src={URL.createObjectURL(file)}
              alt={`${label} Preview`}
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
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
          />
          {file ? (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => document.getElementById(name)?.click()}
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
              onClick={() => document.getElementById(name)?.click()}
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
