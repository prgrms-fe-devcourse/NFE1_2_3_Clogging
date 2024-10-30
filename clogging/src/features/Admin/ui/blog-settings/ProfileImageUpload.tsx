import React from 'react';
import Image from 'next/image';

interface ProfileImageUploadProps {
  label: string;
  name: string;
  file: File | null;
  onChange: (name: string, file: File | null) => void;
}

export default function ProfileImageUpload({
  label,
  name,
  file,
  onChange,
}: ProfileImageUploadProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onChange(name, files[0]);
    }
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
        className="hidden"
      />
      <div
        className="border-2 border-solid border-gray-300 rounded-lg p-4 cursor-pointer flex items-center justify-center"
        onClick={() => document.getElementById(name)?.click()}
      >
        {file ? (
          <Image
            src={URL.createObjectURL(file)}
            alt={`${label} Preview`}
            width={200}
            height={200}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-4xl text-gray-400">+</span>
        )}
      </div>
    </div>
  );
}
