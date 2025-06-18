'use client';

import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { usePathname } from 'next/navigation';

export default function VehiclesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const isVehicleDetailsPage = pathname.split('/').length > 2;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="p-4">
        {children}
      </div>
    </RequireAuth>
  );
} 