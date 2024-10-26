'use client';
import { useTheme } from '@/contexts/ThemeContext';

const FeedPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}
    >
      <h1>Welcome to the Feed Page</h1>
      {/* 여기에 페이지의 다른 내용들을 추가하면 됩니다. */}
    </div>
  );
};

export default FeedPage;
