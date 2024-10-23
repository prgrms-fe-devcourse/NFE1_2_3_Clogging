import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  loading?: boolean; // loading prop 추가
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  className = '',
  children,
  loading = false, // loading 기본값
  disabled,
  ...props
}) => {
  // 기본 스타일
  const baseStyles = [
    'font-medium',
    'rounded-lg',
    'transition-colors',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'inline-flex',
    'items-center',
    'justify-center',
  ];

  // 변형 스타일
  const variants = {
    primary: [
      'bg-blue-500',
      'hover:bg-blue-600',
      'text-white',
      'disabled:bg-blue-300',
    ],
    secondary: [
      'bg-gray-100',
      'hover:bg-gray-200',
      'text-gray-900',
      'dark:bg-gray-700',
      'dark:text-white',
      'dark:hover:bg-gray-600',
    ],
    outline: [
      'border-2',
      'border-gray-200',
      'text-gray-700',
      'hover:bg-gray-50',
      'dark:border-gray-600',
      'dark:text-gray-200',
      'dark:hover:bg-gray-700',
    ],
    ghost: [
      'text-gray-700',
      'hover:bg-gray-100',
      'dark:text-gray-200',
      'dark:hover:bg-gray-700',
    ],
  };

  // 크기 스타일
  const sizes = {
    sm: ['px-3', 'py-1.5', 'text-sm', 'h-8'],
    default: ['px-4', 'py-2', 'text-base', 'h-10'],
    lg: ['px-6', 'py-3', 'text-lg', 'h-12'],
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        loading && 'cursor-wait',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};
