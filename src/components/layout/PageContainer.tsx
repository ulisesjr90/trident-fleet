import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`px-3 sm:px-4 py-2 sm:py-4 ${className}`}>
      <div className="space-y-3 sm:space-y-4">
        {children}
      </div>
    </div>
  );
} 