import { useEffect, useState } from 'react';
import { useTheme } from '@/shared/providers/theme';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  onHeadingClick: (id: string) => void;
}

export const TableOfContents = ({
  content,
  onHeadingClick,
}: TableOfContentsProps) => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const { isDarkMode } = useTheme();

  // 목차 생성
  useEffect(() => {
    const generateToc = () => {
      // DOM이 완전히 업데이트될 때까지 약간 대기
      setTimeout(() => {
        const contentElement = document.getElementById('post-content');
        if (!contentElement) return;

        const headings = contentElement.querySelectorAll(
          'h1, h2, h3, h4, h5, h6',
        );
        const items: TocItem[] = [];

        headings.forEach((heading, index) => {
          const id = `heading-${index}`;
          heading.id = id;

          items.push({
            id,
            text: heading.textContent || '',
            level: parseInt(heading.tagName[1]),
          });
        });

        console.log('생성된 목차 항목들:', items);
        setTocItems(items);
      }, 100);
    };

    // 마크다운 렌더링 완료 이벤트 리스너
    const handleMarkdownRendered = () => {
      generateToc();
    };

    document.addEventListener('markdownRendered', handleMarkdownRendered);

    return () => {
      document.removeEventListener('markdownRendered', handleMarkdownRendered);
    };
  }, [content]);

  // 현재 보고 있는 섹션 하이라이트
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' },
    );

    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
      observer.observe(heading);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  if (tocItems.length === 0) return null;

  return (
    <nav className={`
      hidden lg:block
      sticky top-4 mb-8 p-4 
      ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} 
      rounded-lg
      max-h-[calc(100vh-2rem)] overflow-y-auto
      scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent
      md:w-64 lg:w-72
    `}>
      <h2 className="text-base sm:text-lg font-bold mb-2 sm:mb-4 flex gap-2 items-center">
        <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>|</span>
        <span className={`mt-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>목차</span>
      </h2>
      <div className="space-y-1 sm:space-y-2">
        {tocItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onHeadingClick(item.id)}
            className={`
              block text-left w-full
              text-sm sm:text-base
              transition-colors duration-200
              hover:text-blue-500 
              ${item.level === 1 ? 'font-bold' : 'font-normal'}
              ${activeId === item.id 
                ? 'text-blue-500' 
                : isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }
            `}
            style={{ 
              paddingLeft: `${(item.level - 1) * 0.75}rem`
            }}
          >
            {item.text}
          </button>
        ))}
      </div>
    </nav>
  );
};
