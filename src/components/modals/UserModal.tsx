import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common';
import { UserRole } from '../../types/user';
import type { FirestoreUser } from '../../services/userService';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: Partial<FirestoreUser>) => Promise<void>;
  user?: FirestoreUser;
  mode: 'create' | 'edit';
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  mode
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: UserRole;
    status: 'active' | 'inactive';
  }>({
    name: '',
    email: '',
    role: UserRole.REPRESENTATIVE,
    status: 'active'
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: UserRole.REPRESENTATIVE,
        status: 'active'
      });
    }
  }, [user, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Add New User' : 'Edit User'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="
                w-full
                px-3
                py-2
                border
                border-gray-300
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-transparent
              "
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="
                w-full
                px-3
                py-2
                border
                border-gray-300
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-transparent
              "
              required
              disabled={mode === 'edit'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="
                w-full
                px-3
                py-2
                border
                border-gray-300
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-transparent
              "
            >
              <option value={UserRole.REPRESENTATIVE}>Representative</option>
              <option value={UserRole.ADMIN}>Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              className="
                w-full
                px-3
                py-2
                border
                border-gray-300
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-transparent
              "
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="secondary"
              onClick={onClose}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create User' : 'Update User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 