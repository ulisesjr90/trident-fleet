import { ReactNode } from 'react';
import { getTypographyClass } from '@/lib/typography';

interface MobileCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MobileCard({ children, className = '', onClick }: MobileCardProps) {
  return (
    <div 
      className={`block md:hidden bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface MobileCardTitleProps {
  children: ReactNode;
  className?: string;
}

export function MobileCardTitle({ children, className = '' }: MobileCardTitleProps) {
  return (
    <h3 className={`${getTypographyClass('header')} ${className}`}>
      {children}
    </h3>
  );
}

interface MobileCardTextProps {
  children: ReactNode;
  className?: string;
}

export function MobileCardText({ children, className = '' }: MobileCardTextProps) {
  return (
    <p className={`${getTypographyClass('body')} ${className}`}>
      {children}
    </p>
  );
} 