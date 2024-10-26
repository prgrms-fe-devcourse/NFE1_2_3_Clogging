import { useEffect, useState } from 'react';

export const PostTableOfContents = () => {
  const [activeId, setActiveId] = useState('');

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

    document.querySelectorAll('h2, h3').forEach((heading) => {
      observer.observe(heading);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-4">
      <h2 className="text-lg font-bold mb-4">Table of Contents</h2>
      {/* TOC items */}
    </nav>
  );
};
