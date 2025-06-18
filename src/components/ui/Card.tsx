import { ReactNode } from 'react';
import { getTypographyClass } from '@/lib/typography';

interface CardProps {
  title?: string;
  children: ReactNode;
  error?: string;
  className?: string;
}

export function Card({ title, children, error, className = '' }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      {title && (
        <div className="px-4 py-5 sm:px-6">
          <h3 className={getTypographyClass('header')}>{title}</h3>
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">
        {error ? (
          <div className={getTypographyClass('body')}>
          {error}
        </div>
      ) : (
        children
      )}
      </div>
    </div>
  );
} 