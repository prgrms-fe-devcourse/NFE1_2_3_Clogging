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
        'rounded-lg shadow-sm p-4 bg-white dark:bg-gray-800',
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
    className={cn('flex items-start justify-between mb-4', className)}
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
  <h4 className={cn('text-lg font-semibold', className)} {...props}>
    {children}
  </h4>
);

export const CardDescription = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn('text-sm text-gray-500 dark:text-gray-400 mt-1', className)}
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
  <div className={cn(className)} {...props}>
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
      'flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
