import { ReactNode } from 'react';

interface PageHeaderProps {
  children: ReactNode;
  className?: string;
}

export function PageHeader({ children, className = '' }: PageHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-end gap-4 ${className}`}>
      {children}
    </div>
  );
} 