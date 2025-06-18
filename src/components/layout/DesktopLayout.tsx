import { type ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface DesktopLayoutProps {
  children: ReactNode;
}

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="container mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 