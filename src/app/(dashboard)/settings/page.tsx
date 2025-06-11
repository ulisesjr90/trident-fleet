'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';
import { toast } from 'sonner';
import { updateProfile } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential, AuthError } from 'firebase/auth';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { getTypographyClass } from '@/lib/typography';
import { DataTable, DataTableHeader, DataTableBody, DataTableRow, DataTableCell, DataTableHeaderCell } from '@/components/ui/DataTable';
import { PageLayout } from '@/components/layout/PageLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (error: any): string => {
  if (error && typeof error === 'object' && 'code' in error) {
    switch (error.code) {
    case 'auth/wrong-password':
        return 'Current password is incorrect';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later';
    case 'auth/requires-recent-login':
        return 'Please sign out and sign in again to change your password';
    default:
        return 'An error occurred while updating your password';
    }
  }
  return 'An unexpected error occurred';
};

export default function SettingsPage() {
  const { user, signOut, updatePreferences } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Update name when user changes
  useEffect(() => {
    if (user?.displayName) {
      setName(user.displayName);
    }
  }, [user?.displayName]);

  const handleBack = () => {
    router.back();
  };

  // Auto-save name changes when input loses focus
  const handleNameBlur = async () => {
    if (name === user?.displayName) return;
    
    if (!name.trim()) {
      setName(user?.displayName || '');
      toast.error('Name cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({ displayName: name });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
      setName(user?.displayName || '');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key to save and Escape key to cancel
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setName(user?.displayName || '');
      e.currentTarget.blur();
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required');
      return;
  }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user || !user.email) {
        throw new Error('No user is currently signed in');
      }

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);
      
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordChanged(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setPasswordChanged(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      const errorMessage = getAuthErrorMessage(error);
      setPasswordError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsChangingPassword(false);
  }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Clear auth tokens
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      // Redirect to login
      router.push('/');
    } catch (error) {
      toast.error('Failed to sign out');
      console.error(error);
  }
  };

  const handleThemeChange = async (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    if (user) {
      await updatePreferences({ theme: newTheme });
  }
  };

  const renderEditableCell = (field: string, value: string) => {
    if (editingField === field) {
      return (
        <div className="flex items-center gap-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleNameKeyDown}
            autoFocus
            className="flex-1"
          />
          <Button
            variant="ghost"
            onClick={handleNameBlur}
            disabled={isLoading}
            className="h-8 w-8 p-0 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setName(user?.displayName || '');
              setEditingField(null);
            }}
            className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            <AlertCircle className="h-4 w-4" />
          </Button>
        </div>
      );
    }
    return (
      <div 
        onClick={() => {
          setEditingField(field);
          setEditValue(value || user?.displayName || '');
        }}
        className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
      >
        {value || user?.displayName || '-'}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
        <p className={getTypographyClass('body')}>
          Error loading settings: {error}
        </p>
      </div>
    );
  }

  return (
    <PageLayout title="Settings">
      <div className="space-y-6">
        {/* Profile Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className={getTypographyClass('header')}>Profile Information</h2>
          </div>
          <DataTable>
            <DataTableBody>
              <DataTableRow>
                <DataTableCell className="font-medium w-1/3">Name</DataTableCell>
                <DataTableCell>
                  {renderEditableCell('name', name)}
                </DataTableCell>
              </DataTableRow>
              <DataTableRow>
                <DataTableCell className="font-medium w-1/3">Email</DataTableCell>
                <DataTableCell>
                  {user?.email || '-'}
                </DataTableCell>
              </DataTableRow>
              <DataTableRow>
                <DataTableCell className="font-medium w-1/3">Role</DataTableCell>
                <DataTableCell>
                  {user?.role || '-'}
                </DataTableCell>
              </DataTableRow>
            </DataTableBody>
          </DataTable>
        </div>

        {/* Password Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className={getTypographyClass('header')}>Change Password</h2>
          </div>
          <DataTable>
            <DataTableBody>
              <DataTableRow>
                <DataTableCell className="font-medium w-1/3">Current Password</DataTableCell>
                <DataTableCell>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </DataTableCell>
              </DataTableRow>
              <DataTableRow>
                <DataTableCell className="font-medium w-1/3">New Password</DataTableCell>
                <DataTableCell>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </DataTableCell>
              </DataTableRow>
              <DataTableRow>
                <DataTableCell className="font-medium w-1/3">Confirm<br />New Password</DataTableCell>
                <DataTableCell>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </DataTableCell>
              </DataTableRow>
              <DataTableRow>
                <DataTableCell className="font-medium w-1/3">Actions</DataTableCell>
                <DataTableCell>
                  {passwordError && (
                    <div className="flex items-center gap-2 text-red-500 dark:text-red-400 mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <p className={getTypographyClass('body')}>{passwordError}</p>
                    </div>
                  )}

                  {passwordChanged && (
                    <div className="flex items-center gap-2 text-green-500 dark:text-green-400 mb-4">
                      <CheckCircle2 className="h-4 w-4" />
                      <p className={getTypographyClass('body')}>Password updated successfully</p>
                    </div>
                  )}

                  <Button
                    onClick={handlePasswordChange}
                    disabled={isChangingPassword}
                    className="w-full"
                  >
                    {isChangingPassword ? 'Updating...' : 'Update Password'}
                  </Button>
                </DataTableCell>
              </DataTableRow>
            </DataTableBody>
          </DataTable>
        </div>

        {/* Theme Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className={getTypographyClass('header')}>Appearance</h2>
          </div>
          <DataTable>
            <DataTableBody>
              <DataTableRow>
                <DataTableCell className="font-medium w-1/3">Dark Mode</DataTableCell>
                <DataTableCell>
                  <div className="flex items-center justify-between">
                    <Switch
                      checked={resolvedTheme === 'dark'}
                      onCheckedChange={handleThemeChange}
                    />
                  </div>
                </DataTableCell>
              </DataTableRow>
            </DataTableBody>
          </DataTable>
        </div>

        {/* Sign Out Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className={getTypographyClass('header')}>Account</h2>
          </div>
          <div className="p-6">
            <DataTableRow>
              <DataTableCell className="font-medium w-1/3">Sign Out</DataTableCell>
              <DataTableCell>
        <Button
          onClick={handleSignOut}
                  variant="outline"
          className="w-full"
        >
          Sign Out
        </Button>
              </DataTableCell>
            </DataTableRow>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 