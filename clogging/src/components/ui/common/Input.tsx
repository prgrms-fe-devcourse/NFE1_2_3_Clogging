import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className, ...props }) => (
  <input
    className={cn(
      // 기본 스타일
      'w-full',
      'px-3',
      'py-2',
      'border',
      'border-gray-200',
      'rounded-lg',
      'transition-colors',
      'duration-200',

      // 포커스 스타일
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500',
      'focus:border-blue-500',

      // 다크모드 스타일
      'dark:bg-gray-700',
      'dark:border-gray-600',
      'dark:text-white',
      'dark:placeholder-gray-400',

      // 호버 스타일
      'hover:border-gray-300',
      'dark:hover:border-gray-500',

      // 비활성화 스타일
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'disabled:bg-gray-50',
      'dark:disabled:bg-gray-800',

      // 사용자 정의 클래스
      className,
    )}
    {...props}
  />
);
