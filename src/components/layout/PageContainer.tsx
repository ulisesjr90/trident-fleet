import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className="flex-1 bg-white dark:bg-gray-900 w-full">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-4 pb-16">
        <div className={`space-y-4 ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
} 