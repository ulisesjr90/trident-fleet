import { ReactNode } from 'react';
import { getTypographyClass } from '@/lib/typography';

interface DropdownMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function DropdownMenuItem({ children, onClick, className = '' }: DropdownMenuItemProps) {
    return (
      <button
      onClick={onClick}
      className={`flex w-full items-center px-4 py-2 ${getTypographyClass('body')} hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
      >
        {children}
      </button>
    );
  }