'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MobileNavigation } from "@/components/layout/MobileNavigation"
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      console.log('DashboardLayout: No user found, redirecting to login...');
      // Clear any existing auth tokens
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      // Force a hard navigation
      window.location.href = '/';
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        userRole={user.role} 
        isCollapsed={isSidebarCollapsed}
        onCollapseChange={setIsSidebarCollapsed}
      />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-16' : 'md:pl-64'}`}>
        {children}
      </div>
      <MobileNavigation userRole={user.role} />
    </div>
  );
} 