'use client';

import { ReactNode } from 'react';
import { getTypographyClass } from '@/lib/typography';
import { ArrowLeft, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  title: string;
  children?: ReactNode;
  className?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export function Header({ title, children, className = '', showBackButton, onBackClick }: HeaderProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  const renderProfileButton = () => {
    return (
      <Button
        variant="ghost"
        onClick={() => router.push('/settings')}
        className="ml-auto"
      >
        <User className="h-5 w-5" />
      </Button>
    );
  };

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2">
          {showBackButton && (
          <Button
            variant="ghost"
            onClick={handleBackClick}
            className="p-2"
            >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          )}
        <h1 className={getTypographyClass('header')}>
            {title}
          </h1>
      </div>
      {children && (
        <div className="flex flex-wrap gap-2">
          {children}
        </div>
      )}
        {renderProfileButton()}
      </div>
  );
} 