import { useTheme } from '@/shared/providers/theme';
import React from 'react';

interface SettingTextFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  onBlur?: (value: string) => void;
  multiline?: boolean;
}

export default function SettingTextField({
  label,
  name,
  value,
  onChange,
  onBlur,
  multiline = false,
}: SettingTextFieldProps) {
  const { isDarkMode } = useTheme();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (onChange) {
      onChange(name, e.target.value);
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
          className={`${inputClasses} h-32resize-none`}
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
        />
      )}
    </div>
  );
}
