import { ReactNode } from 'react';
import { getTypographyClass } from '@/lib/typography';

interface ContentSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ContentSection({ title, children, className = '' }: ContentSectionProps) {
  return (
    <section className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      <div className="px-4 py-5 sm:px-6">
        <h2 className={getTypographyClass('header')}>{title}</h2>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="px-4 py-5 sm:p-6">
          {children}
        </div>
      </div>
    </section>
  );
} 