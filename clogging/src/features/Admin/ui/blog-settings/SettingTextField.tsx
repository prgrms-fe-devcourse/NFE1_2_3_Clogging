import { useTheme } from '@/shared/providers/theme';
import React, { useState } from 'react';

interface SettingTextFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  onBlur?: (value: string) => void;
  multiline?: boolean;
  maxLength?: number; // 최대 길이를 매개변수로 추가
}

export default function SettingTextField({
  label,
  name,
  value,
  onChange,
  onBlur,
  multiline = false,
  maxLength, // 최대 길이 매개변수
}: SettingTextFieldProps) {
  const { isDarkMode } = useTheme();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(name, newValue);
    }

    // 최대 길이 체크
    if (maxLength && newValue.length > maxLength) {
      setErrorMessage(`최대 ${maxLength}자까지 입력 가능합니다.`);
    } else {
      setErrorMessage('');
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur(value);
    }
  };

  const inputClasses = `w-full px-3 py-2 mt-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
    isDarkMode
      ? 'bg-gray-800 text-white border-gray-600'
      : 'bg-white text-gray-900 border-gray-300'
  }`;

  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`${inputClasses} h-32 resize-none`}
          maxLength={maxLength}
        />
      ) : (
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputClasses}
          maxLength={maxLength}
        />
      )}
      {errorMessage && (
        <p
          className={`text-xs mt-1 ${isDarkMode ? 'text-sky-200' : 'text-red-500'}`}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
