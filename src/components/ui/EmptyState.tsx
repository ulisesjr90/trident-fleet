import { ReactNode } from 'react';
import { getTypographyClass } from '@/lib/typography';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <h3 className={getTypographyClass('header')}>
        {title}
      </h3>
      <p className={getTypographyClass('body')}>
        {description}
      </p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
} 