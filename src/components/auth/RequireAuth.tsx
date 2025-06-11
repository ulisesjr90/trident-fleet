'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';
import { getTypographyClass } from '@/lib/typography';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Debug auth state
    // console.log('RequireAuth: Auth State:', { user, loading });
    // console.log('RequireAuth: Cookies:', document.cookie);

    if (!loading && !user) {
      // console.log('RequireAuth: No user found, redirecting to login...');
      // Small delay to show the message before redirecting
      const timer = setTimeout(() => {
        // console.log('RequireAuth: Executing redirect...');
        // Force a hard navigation to ensure the middleware picks up the new auth state
        window.location.href = '/';
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <Card className="max-w-md w-full p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h2 className={getTypographyClass('header')}>
              Authentication Required
            </h2>
            <p className={getTypographyClass('body')}>
              You must be signed in to view this page. Redirecting to login...
            </p>
            <Button
              onClick={() => {
                // console.log('RequireAuth: Manual redirect clicked');
                // Clear any existing auth tokens
                document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                window.location.href = '/';
              }}
              className="mt-4"
            >
              Go to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
} 