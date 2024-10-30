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

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur} // 포커스를 잃었을 때 호출
        />
      ) : (
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur} // 포커스를 잃었을 때 호출
        />
      )}
    </div>
  );
}
