'use client';

import { ArrowLeft } from 'lucide-react';
import { HeaderProps } from '@/types/layout';

export function Header({ title, showBackButton, onBackClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pt-safe">
      <div className="h-14 px-4 flex items-center justify-center relative">
        {showBackButton && (
          <button
            onClick={onBackClick}
            className="absolute left-4 p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>
      </div>
    </header>
  );
} 