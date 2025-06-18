import { type ReactNode } from 'react';
import Header from './Header';
import MobileNavigation from './MobileNavigation';

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pb-20 p-4">
        {children}
      </main>
      <MobileNavigation />
    </div>
  );
} 