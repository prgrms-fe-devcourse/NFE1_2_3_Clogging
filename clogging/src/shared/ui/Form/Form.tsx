import { cn } from '@/shared/lib/utils';

// Textarea 컴포넌트
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => (
  <textarea
    className={cn(
      // 기본 스타일
      'w-full',
      'px-3',
      'py-2',
      'border',
      'border-gray-200',
      'rounded-lg',
      'resize-none',
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

      className,
    )}
    {...props}
  />
);

// FormSection 헤더 컴포넌트
interface FormSectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

const FormSectionHeader: React.FC<FormSectionHeaderProps> = ({
  title,
  className,
  ...props
}) => (
  <h3 className={cn('text-lg font-medium', className)} {...props}>
    {title}
  </h3>
);

// FormSection 아이템 컴포넌트
interface FormSectionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const FormSectionItem = ({
  title,
  children,
  className,
  ...props
}: FormSectionItemProps) => (
  <div
    className={cn(
      'flex',
      {
        'flex-col space-y-2': className?.includes('flex-col'),
      },
      className,
    )}
    {...props}
  >
    {title && <FormSectionHeader title={title} />}
    {children}
  </div>
);
