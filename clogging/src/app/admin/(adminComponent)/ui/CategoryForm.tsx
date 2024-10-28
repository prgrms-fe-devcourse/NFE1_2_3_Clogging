import React, { useState } from 'react';
import { Button, Input } from '@/shared/ui/common';

interface CategoryFormProps {
  onSubmit: (name: string) => void;
  initialValue?: string;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  onSubmit,
  initialValue = '',
}) => {
  const [name, setName] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="카테고리 이름"
        className="mr-2"
      />
      <Button type="submit">{initialValue ? '수정' : '추가'}</Button>
    </form>
  );
};
