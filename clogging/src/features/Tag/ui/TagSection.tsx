'use client';
import { Button } from '@/shared/ui/common/Button';
import { useTagSection, UseTagSectionProps } from '@/features/Tag/hooks';

const TagSection: React.FC<UseTagSectionProps> = (props) => {
  const { selectedTags, popularTags, handleTagClick, maxRows } =
    useTagSection(props);

  return (
    <div className="mb-8">
      <div className="flex justify-center">
        <div className="flex flex-wrap gap-3 items-center justify-center max-w-[800px]">
          {' '}
          {/* justify-center 추가 */}
          <Button
            variant="outline"
            onClick={() => handleTagClick('기타')}
            className={`h-9 px-6 rounded-full transition-colors whitespace-nowrap border border-primary text-primary font-semibold ${
              selectedTags.includes('기타')
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'hover:bg-primary/10'
            }`}
          >
            ...
          </Button>
          {popularTags.map((tag) => (
            <Button
              key={tag}
              variant="outline"
              onClick={() => handleTagClick(tag)}
              className={`h-9 px-6 rounded-full transition-colors whitespace-nowrap border border-primary text-primary font-semibold ${
                selectedTags.includes(tag)
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'hover:bg-primary/10'
              }`}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default TagSection;
