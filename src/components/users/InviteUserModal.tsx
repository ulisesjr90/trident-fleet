import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getTypographyClass } from '@/lib/typography';

type UserRole = 'admin' | 'rep';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function InviteUserModal({ isOpen, onClose, onSuccess }: InviteUserModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('rep');
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Implement user invitation logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call

      // Reset form
        setEmail('');
        setRole('rep');
      setFormError(null);

      onSuccess?.();
        onClose();
    } catch (err) {
      console.error('Error inviting user:', err);
      setFormError('Failed to invite user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-16">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
          <h2 className={getTypographyClass('header')}>Invite User</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-3 space-y-4">
          {formError && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-2 rounded-md">
              <p className={getTypographyClass('body')}>
                {formError}
              </p>
            </div>
          )}

          <div className="space-y-4">
          <div>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address *"
                required
            />
          </div>

          <div>
              <div className="relative">
            <select
              id="role"
              value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  aria-label="Select user role"
            >
              <option value="rep">Representative</option>
              <option value="admin">Administrator</option>
            </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Inviting...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 