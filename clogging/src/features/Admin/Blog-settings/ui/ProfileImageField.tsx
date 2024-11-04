import React, { useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui/common/Button';
import { useTheme } from '@/shared/providers/theme';
import SettingsDisplay from './SettingsDisplay';

interface ProfileImageFieldProps {
  label: string;
  name: string;
  file: File | null;
  onChange: (name: string, file: File | null) => void;
  onDelete: (name: string) => void;
  previewUrl?: string; // 미리보기 URL 추가
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

  // 이미지 사이즈를 표시하기 위한 함수
  const getFileSize = (file: File | null) => {
    if (file) {
      const sizeInKB = (file.size / 1024).toFixed(2); // KB 단위로 변환
      return `${sizeInKB} KB`;
    }
    return '0 KB';
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center mb-4">
          <div
            className={`relative w-[120px] h-[120px] border rounded-full overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={`${label} Preview`}
                width={120}
                height={120}
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
        </div>

        {/* 파일 입력 */}
        <input
          type="file"
          id={name}
          name={name}
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files) {
              onChange(name, e.target.files[0]);
            }
          }}
        />

        {/* 버튼 그룹 */}
        <div className="flex justify-center space-x-2">
          {/* 선택적 설정 표시 */}
          <SettingsDisplay imageType="profile" />
        </div>
        {file ? (
          <>
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

      {/* 이미지 사이즈 표시 */}
      {file && (
        <div
          className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
        >
          등록된 이미지 사이즈: {getFileSize(file)}
        </div>
      )}
    </div>
  );
}
