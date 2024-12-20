import { Search } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useState } from 'react'; // useState import 추가

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
  const [inputValue, setInputValue] = useState(''); // 입력값 상태 추가

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    onSearch?.(inputValue);
  };

  // Enter 키 입력 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={cn('flex', 'gap-2', className)} {...props}>
      <div className={cn('relative', 'flex-1', 'group')}>
        <Input
          value={inputValue}
          placeholder={placeholder}
          className={cn(
            'pl-10',
            'transition-colors',
            'duration-200',
            'group-hover:border-gray-300',
            'dark:group-hover:border-gray-500',
          )}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown} // Enter 키 이벤트 추가
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
            'group-hover:text-gray-500',
            'dark:group-hover:text-gray-300',
          )}
        />
      </div>
      <Button variant="primary" onClick={handleSearch}>
        {buttonText}
      </Button>
    </div>
  );
};
