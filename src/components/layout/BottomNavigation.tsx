'use client';

import { useRouter } from 'next/navigation';
import { Home, Car, Users, UserCog, Settings, LucideIcon } from 'lucide-react';
import { BottomNavigationProps } from '@/types/layout';
import { cn } from '@/lib/utils';

// Define a type for our navigation icons
type NavigationIcon = 'home' | 'car' | 'users' | 'userCog' | 'settings';

// Map of icon names to their components
const ICON_MAP: Record<NavigationIcon, LucideIcon> = {
  home: Home,
  car: Car,
  users: Users,
  userCog: UserCog,
  settings: Settings,
} as const;

// Navigation item button component
function NavigationItem({
  item,
  onClick,
}: {
  item: BottomNavigationProps['items'][number];
  onClick: () => void;
}) {
  const Icon = ICON_MAP[item.icon as NavigationIcon];

  return (
    <button
      onClick={onClick}
      className={cn(
        'p-2 flex flex-col items-center justify-center transition-colors duration-200',
        item.isActive
          ? 'text-primary'
          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
      )}
      aria-label={item.label}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
}

export function BottomNavigation({ items }: BottomNavigationProps) {
  const router = useRouter();

  const handleNavigation = (href: string) => {
    // Prevent navigation if already on the same page
    if (window.location.pathname === href) return;
    router.push(href);
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="h-16 px-4 flex items-center justify-around">
        {items.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            onClick={() => handleNavigation(item.href)}
          />
        ))}
      </div>
    </nav>
  );
} 