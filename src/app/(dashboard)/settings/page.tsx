'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { updateProfile, updatePassword, deleteUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Toast, ToastType } from '@/components/ui/Toast';
import { useTheme } from '@/components/providers/ThemeProvider';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { PageContainer } from '@/components/layout/PageContainer';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const { isDarkMode, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Initialize state from session and Firestore
  useEffect(() => {
    const initializeSettings = async () => {
      if (!session?.user?.id) return;

      try {
        // Get user document from Firestore
        const userRef = doc(db, 'users', session.user.id);
        const userDoc = await getDoc(userRef);
        
        // Set name from Firestore if available, otherwise from session
        if (userDoc.exists() && userDoc.data().displayName) {
          setName(userDoc.data().displayName);
        } else if (session.user.name) {
          setName(session.user.name);
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
        showToast('Failed to load preferences', 'error');
      }
    };

    initializeSettings();
  }, [session]);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!auth.currentUser || !session?.user?.id) {
        throw new Error('No user logged in');
      }

      // Update Firebase profile
      await updateProfile(auth.currentUser, {
        displayName: name,
      });

      // Update user document in Firestore
      const userRef = doc(db, 'users', session.user.id);
      await setDoc(userRef, {
        displayName: name,
        updatedAt: new Date().toISOString(),
        preferences: {
          darkMode: isDarkMode,
          language: 'en'
        }
      }, { merge: true });

      // Update NextAuth session
      await update({
        ...session,
        user: {
          ...session.user,
          name,
        },
      });

      showToast('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!auth.currentUser) {
        throw new Error('No user logged in');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      await updatePassword(auth.currentUser, newPassword);
      showToast('Password updated successfully', 'success');
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      showToast(error instanceof Error ? error.message : 'Failed to update password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);

    try {
      if (!auth.currentUser || !session?.user?.id) {
        throw new Error('No user logged in');
      }

      // Delete user preferences
      const userPrefsRef = doc(db, 'user_preferences', session.user.id);
      await setDoc(userPrefsRef, { deleted: true }, { merge: true });

      // Delete user document
      const userRef = doc(db, 'users', session.user.id);
      await setDoc(userRef, { deleted: true }, { merge: true });

      // Delete Firebase auth account
      await deleteUser(auth.currentUser);
      showToast('Account deleted successfully', 'success');
      // Redirect will be handled by the auth state change
    } catch (error) {
      console.error('Error deleting account:', error);
      showToast('Failed to delete account', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeToggle = async () => {
    try {
      await toggleTheme();
      showToast(`${!isDarkMode ? 'Dark' : 'Light'} mode enabled`, 'success');
    } catch (error) {
      showToast('Failed to save theme preference', 'error');
    }
  };

  return (
    <MobileLayout
      header={{
        title: 'Settings',
        showBackButton: false
      }}
      currentPath={pathname}
      userRole={session?.user?.role}
    >
      <PageContainer>
        {/* Profile Section */}
        <Card className="bg-white dark:bg-[#1f2937] transition-colors duration-300">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">Profile</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={session?.user?.email || ''}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors duration-300"
                />
              </div>
              <Button type="submit" isLoading={isLoading}>
                Update Profile
              </Button>
            </form>
          </div>
        </Card>

        {/* Theme Section */}
        <Card className="bg-white dark:bg-[#1f2937] transition-colors duration-300">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">Theme</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">Dark Mode</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Enable dark mode for the application</p>
                </div>
                <button
                  onClick={handleThemeToggle}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${
                      isDarkMode ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  >
                    {isDarkMode ? (
                      <svg className="h-6 w-6 p-1 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6 p-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Password Change Section */}
        <Card className="bg-white dark:bg-[#1f2937] transition-colors duration-300">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Current Password
                </label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  New Password
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                />
              </div>
              <Button type="submit" isLoading={isLoading}>
                Change Password
              </Button>
            </form>
          </div>
        </Card>

        {/* Account Management Section */}
        <Card className="bg-white dark:bg-[#1f2937] transition-colors duration-300">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">Account Management</h2>
            <div className="space-y-4">
              <Button 
                variant="danger" 
                className="w-full"
                onClick={handleAccountDeletion}
                isLoading={isLoading}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </Card>
      </PageContainer>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </MobileLayout>
  );
} 