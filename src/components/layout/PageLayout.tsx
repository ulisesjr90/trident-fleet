import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  headerContent?: ReactNode;
  bottomPadding?: string;
}

export function PageLayout({ children, title, headerContent, bottomPadding = 'pb-20' }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b bg-white dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300">
        <div className="flex h-full items-center justify-center">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
            {title}
          </h1>
        </div>
      </header>

      <div className="pt-14">
        <div className={`container mx-auto px-4 py-4 ${bottomPadding}`}>
          {headerContent && (
            <div className="mb-4">
              {headerContent}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
} 