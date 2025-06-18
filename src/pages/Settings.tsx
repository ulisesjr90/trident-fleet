import React, { useState, useEffect } from 'react';
import InlineEdit from '@/components/common/InlineEdit';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/userService';
import { auth } from '@/config/firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import type { FirestoreUser } from '@/services/userService';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Lock } from 'lucide-react';
import { SuccessModal } from '@/components/modals/SuccessModal';

export default function Settings() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) return;
      try {
        const data = await userService.getUserById(user.uid);
        setUserData(data);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user?.uid]);

  const updateField = async (field: keyof FirestoreUser, value: any) => {
    if (!user?.uid || !userData) return;
    try {
      await userService.updateUser(user.uid, { [field]: value });
      setUserData(prev => prev ? { ...prev, [field]: value } : null);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setIsSubmitting(true);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      setIsSubmitting(false);
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error('No authenticated user found');
      }

      // First reauthenticate
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordForm.currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Then update password
      await updatePassword(currentUser, passwordForm.newPassword);
      
      setShowSuccessModal(true);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordChange(false);
    } catch (err: any) {
      console.error('Error changing password:', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setPasswordError('Current password is incorrect');
      } else if (err.code === 'auth/weak-password') {
        setPasswordError('Password is too weak. Please choose a stronger password');
      } else if (err.code === 'auth/requires-recent-login') {
        setPasswordError('For security reasons, please log out and log back in before changing your password');
      } else if (err.code === 'auth/too-many-requests') {
        setPasswordError('Too many attempts. Please try again later');
      } else if (err.code === 'auth/network-request-failed') {
        setPasswordError('Network error. Please check your connection and try again');
      } else {
        setPasswordError('Failed to update password. Please try again later');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!userData) {
    return <div>User data not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="p-4 sm:p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Information</h2>
              <dl className="grid grid-cols-1 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                  <dd className="mt-1">
                    <InlineEdit
                      value={userData.name}
                      onSave={value => updateField('name', value)}
                    />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                  <dd className="mt-1 text-gray-900 dark:text-gray-100 break-all">{userData.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      userData.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {userData.role === 'admin' ? 'Admin' : 'Rep'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Security</h2>
              {!showPasswordChange ? (
                <Button
                  variant="secondary"
                  onClick={() => setShowPasswordChange(true)}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Lock className="w-4 h-4" />
                  Change Password
                </Button>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-4">
                    <Input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Current Password"
                      required
                      error={passwordError || undefined}
                      className="w-full"
                    />
                    <Input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="New Password"
                      required
                      className="w-full"
                    />
                    <Input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={e => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm New Password"
                      required
                      className="w-full"
                    />
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Button 
                        type="submit" 
                        variant="primary"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto"
                      >
                        <Lock className="w-4 h-4" />
                        Update Password
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setShowPasswordChange(false);
                          setPasswordError(null);
                          setPasswordForm({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          });
                        }}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                  Theme
                </label>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Password Updated"
        message="Your password has been successfully updated."
      />
    </div>
  );
} 