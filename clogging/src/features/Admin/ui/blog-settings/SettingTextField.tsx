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

  const inputClasses =
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

  return (
    <div className="mb-4">
      <label htmlFor={name} className="text-xs text-gray-500">
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
