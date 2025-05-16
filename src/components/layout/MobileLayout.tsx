'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { MobileLayoutProps } from '@/types/layout';

// Define base navigation items that are visible to all users
const baseNavigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'home',
    href: '/dashboard',
  },
  {
    id: 'vehicles',
    label: 'Vehicles',
    icon: 'car',
    href: '/vehicles',
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: 'users',
    href: '/customers',
  },
];

// Admin-only navigation items
const adminNavigationItems = [
  {
    id: 'users',
    label: 'Users',
    icon: 'userCog',
    href: '/users',
  },
];

// Settings is always last
const settingsItem = {
  id: 'settings',
  label: 'Settings',
  icon: 'settings',
  href: '/settings',
};

export function MobileLayout({
  children,
  header,
  showBottomNav = true,
  userRole,
}: MobileLayoutProps) {
  const pathname = usePathname();

  // Function to check if a path is active
  const isPathActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Combine navigation items based on user role, ensuring settings is last
  const navigationItems = [
    ...baseNavigationItems,
    ...(userRole === 'admin' ? adminNavigationItems : []),
    settingsItem,
  ].map(item => ({
    ...item,
    isActive: isPathActive(item.href)
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {header && (
        <Header
          title={header.title}
          showBackButton={header.showBackButton}
          onBackClick={header.onBackClick}
        />
      )}
      <main
        className={`min-h-screen ${
          header ? 'pt-[56px]' : ''
        } ${showBottomNav ? 'pb-16' : ''}`}
      >
        {children}
      </main>
      {showBottomNav && (
        <BottomNavigation
          currentPath={pathname}
          userRole={userRole}
          items={navigationItems}
        />
      )}
    </div>
  );
} 