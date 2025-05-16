import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface InviteUserModalProps {
  onClose: () => void;
  onInvite: (email: string, role: 'rep' | 'admin') => Promise<boolean>;
}

export function InviteUserModal({ onClose, onInvite }: InviteUserModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'rep' | 'admin'>('rep');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const success = await onInvite(email, role);
      if (success) {
        setEmail('');
        setRole('rep');
        onClose();
      }
    } catch (err) {
      setError('Failed to invite user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Invite User" onClose={onClose}>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'rep' | 'admin')}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
            >
              <option value="rep">Representative</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <div className="flex justify-end gap-3">
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Inviting...' : 'Invite User'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
} 