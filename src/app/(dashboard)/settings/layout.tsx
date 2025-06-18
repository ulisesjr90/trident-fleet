'use client';

import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RequireAuth } from '@/components/auth/RequireAuth';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <RequireAuth>
        {children}
    </RequireAuth>
  );
} 