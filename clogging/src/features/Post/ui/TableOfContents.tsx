import { useEffect, useState } from 'react';

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

  // 목차 생성
  useEffect(() => {
    const generateToc = () => {
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

      setTocItems(items);
    };

    setTimeout(generateToc, 100);
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
    <nav className="sticky top-4 mb-8 p-4 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-bold mb-4">목차</h2>
      {tocItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onHeadingClick(item.id)}
          className={`
            block text-left hover:text-blue-600 mb-1
            ${item.level === 1 ? 'font-bold' : ''}
            ${activeId === item.id ? 'text-blue-600' : 'text-gray-600'}
          `}
          style={{ marginLeft: `${(item.level - 1) * 1}rem` }}
        >
          {item.text}
        </button>
      ))}
    </nav>
  );
};
