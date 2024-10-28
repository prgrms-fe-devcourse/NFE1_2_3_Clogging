import { Search } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface SearchBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onSearch?: (value: string) => void;
  placeholder?: string;
  buttonText?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = '검색어를 입력하세요',
  buttonText = '검색',
  className,
  ...props
}) => {
  return (
    <div className={cn('flex', 'gap-2', className)} {...props}>
      <div
        className={cn(
          'relative',
          'flex-1',
          'group', // 호버 효과를 위한 그룹
        )}
      >
        <Input
          placeholder={placeholder}
          className={cn(
            'pl-10',
            'transition-colors',
            'duration-200',
            // 그룹 호버 시 아이콘 색상 변경과 함께 변화
            'group-hover:border-gray-300',
            'dark:group-hover:border-gray-500',
          )}
          onChange={(e) => onSearch?.(e.target.value)}
        />
        <Search
          className={cn(
            'absolute',
            'left-3',
            'top-1/2',
            '-translate-y-1/2',
            'w-5',
            'h-5',
            'text-gray-400',
            'transition-colors',
            'duration-200',
            // 그룹 호버 시 색상 변경
            'group-hover:text-gray-500',
            'dark:group-hover:text-gray-300',
          )}
        />
      </div>
      <Button variant="primary">{buttonText}</Button>
    </div>
  );
};
