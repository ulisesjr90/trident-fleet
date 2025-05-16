import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
  error?: string;
}

export function Card({ children, className, onClick, isLoading, error }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-[#1f2937] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700',
        'transition-all duration-200 ease-in-out',
        'hover:shadow-md dark:hover:shadow-gray-900/20',
        'active:scale-[0.98]',
        'touch-manipulation',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {isLoading ? (
        <div className="p-4 animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      ) : error ? (
        <div className="p-4 text-red-500 dark:text-red-400 text-sm">
          {error}
        </div>
      ) : (
        children
      )}
    </div>
  );
} 