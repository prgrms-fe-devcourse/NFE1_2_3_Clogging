import React from 'react';
import { useTheme } from '@/shared/providers/theme';

const EmptyComment: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <p
      className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
    >
      최근 댓글이 없습니다.
    </p>
  );
};

export default EmptyComment;
