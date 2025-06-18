import type { ReactNode } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import DesktopLayout from './DesktopLayout';
import MobileLayout from './MobileLayout';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return isDesktop ? (
    <DesktopLayout>{children}</DesktopLayout>
  ) : (
    <MobileLayout>{children}</MobileLayout>
  );
} 