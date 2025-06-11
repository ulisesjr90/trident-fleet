'use client';

import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Car, 
  Users, 
  UserCog, 
  Settings, 
  LogOut, 
  Sun,
  Moon
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/Button';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';

interface MobileNavigationProps {
  userRole?: 'admin' | 'rep';
}

export function MobileNavigation({ userRole }: MobileNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, updatePreferences } = useAuth();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      href: '/dashboard',
      show: true
    },
    {
      id: 'vehicles',
      label: 'Vehicles',
      icon: Car,
      href: '/vehicles',
      show: true
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      href: '/customers',
      show: true
    },
    {
      id: 'users',
      label: 'Users',
      icon: UserCog,
      href: '/users',
      show: userRole === 'admin'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/settings',
      show: true
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (user) {
      await updatePreferences({ theme: newTheme });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden">
      <div className="flex items-center justify-around p-2">
        {navigationItems
          .filter(item => item.show)
          .map(item => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Button
                key={item.id}
                variant={isActive ? 'default' : 'outline'}
                className="flex-1 mx-1"
                onClick={() => router.push(item.href)}
              >
                <item.icon className="w-5 h-5" />
              </Button>
            );
          })}
      </div>
    </div>
  );
} 