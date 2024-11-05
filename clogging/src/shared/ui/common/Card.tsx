import { cn } from '@/shared/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  badge?: React.ReactNode;
}

export const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-lg shadow-sm p-3 sm:p-4 bg-white dark:bg-gray-800',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// 하위 컴포넌트들
export const CardHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-row sm:flex-col sm:items-start sm:justify-between mb-3 sm:mb-4',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h4
    className={cn('text-base sm:text-lg font-semibold', className)}
    {...props}
  >
    {children}
  </h4>
);

export const CardDescription = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn(
      'text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1',
      className,
    )}
    {...props}
  >
    {children}
  </p>
);

export const CardContent = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('text-sm sm:text-base', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
