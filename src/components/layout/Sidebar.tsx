'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Car, 
  Users, 
  UserCog, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/Button';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  userRole?: 'admin' | 'rep';
  isCollapsed: boolean;
  onCollapseChange: (collapsed: boolean) => void;
}

export function Sidebar({ userRole, isCollapsed, onCollapseChange }: SidebarProps) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
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

  const filteredNavigationItems = navigationItems.filter(item => 
    item.show
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (user) {
      await updatePreferences({ theme: newTheme });
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div 
      className={`fixed left-0 top-20 h-[calc(100vh-5rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 hidden md:block ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => onCollapseChange(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full p-1"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.displayName || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="p-2">
        {filteredNavigationItems
          .map(item => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Button
                key={item.id}
                variant={isActive ? 'default' : 'outline'}
                className={`w-full justify-start mb-1 ${
                  isCollapsed ? 'px-2' : 'px-4'
                }`}
                onClick={() => router.push(item.href)}
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && (
                  <span className="ml-3">{item.label}</span>
                )}
              </Button>
            );
          })}
      </nav>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="space-y-2">
          <Button
            variant="outline"
            className={`w-full justify-start ${
              isCollapsed ? 'px-2' : 'px-4'
            }`}
            onClick={toggleTheme}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            {!isCollapsed && (
              <span className="ml-3">
                {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            className={`w-full justify-start text-red-600 hover:text-red-700 ${
              isCollapsed ? 'px-2' : 'px-4'
            }`}
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && (
              <span className="ml-3">Sign Out</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 