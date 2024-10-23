import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'error';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variants = {
    default: [
      'bg-blue-100',
      'text-blue-600',
      'dark:bg-blue-900',
      'dark:text-blue-200',
    ],
    secondary: [
      'bg-gray-100',
      'text-gray-600',
      'dark:bg-gray-700',
      'dark:text-gray-200',
    ],
    success: [
      'bg-green-100',
      'text-green-600',
      'dark:bg-green-900',
      'dark:text-green-200',
    ],
    error: [
      'bg-red-100',
      'text-red-600',
      'dark:bg-red-900',
      'dark:text-red-200',
    ],
  };

  return (
    <span
      className={cn(
        // 기본 스타일
        'inline-flex',
        'items-center',
        'px-2',
        'py-1',
        'rounded',
        'text-xs',
        'font-medium',
        'transition-colors',
        'duration-200',
        // 변형 스타일
        variants[variant],
        // 사용자 정의 클래스
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
