'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useUsers, type User } from '@/hooks/useUsers';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, ShieldAlert, AlertCircle } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { cn } from '@/lib/utils';

// Separate components for better organization and reusability
function AccessDeniedScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You don't have permission to access this page. This area is restricted to administrators only.
        </p>
        <Button
          onClick={() => window.history.back()}
          variant="outline"
          className="w-full"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
    </div>
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Error
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {message}
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="w-full"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}

function UserCard({ user }: { user: User }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        {user.displayName}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{user.email}</p>
      <div className="flex items-center justify-between">
        <span className={cn(
          'px-2 py-1 rounded-full text-xs',
          user.role === 'admin' 
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        )}>
          {user.role}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

function InviteUserModal({ 
  isOpen, 
  onClose, 
  onInvite 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onInvite: (email: string) => Promise<boolean>;
}) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const success = await onInvite(email);
      if (success) {
        setEmail('');
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invite user');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Invite User</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
            required
          />
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !email}
            >
              {isSubmitting ? 'Inviting...' : 'Send Invite'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const { data: session, status } = useSession();
  const { users, loading, error, inviteUser } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  // Show access denied screen for non-admin users
  if (!session || session.user.role !== 'admin') {
    return <AccessDeniedScreen />;
  }

  // Show error screen if there's an error
  if (error) {
    return <ErrorScreen message={error} />;
  }

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return searchQuery === '' || 
      user.displayName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower);
  });

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <Button onClick={() => setIsInviting(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Invite User
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {searchQuery ? 'No users found matching your search' : 'No users found'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}

        <InviteUserModal
          isOpen={isInviting}
          onClose={() => setIsInviting(false)}
          onInvite={inviteUser}
        />
      </div>
    </ErrorBoundary>
  );
} 