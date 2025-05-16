import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { UserSelect } from './UserSelect';
import { useShareCustomer } from '@/hooks/useShareCustomer';
import { validateUserSelection } from '@/utils/validation';
import { ShareCustomerModalProps } from '@/types/customer';

export function ShareCustomerModal({ customer, onClose, onSuccess }: ShareCustomerModalProps) {
  const { data: session } = useSession();
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const {
    users,
    loading,
    error: apiError,
    fetchUsers,
    shareCustomer
  } = useShareCustomer(customer.id);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleShare = async () => {
    if (!selectedUser || !session?.user?.id) return;

    // Validate selection
    const error = validateUserSelection(selectedUser, users);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    
    const success = await shareCustomer(selectedUser);
    if (success) {
      onSuccess();
    }
  };

  return (
    <Modal title={`Share ${customer.name}`} onClose={onClose}>
      <div className="p-6">
        <div className="space-y-6">
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {apiError}
            </div>
          )}

          <UserSelect
            users={users}
            value={selectedUser}
            onChange={setSelectedUser}
            error={validationError || undefined}
            disabled={loading}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="accent"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              disabled={loading || !selectedUser}
            >
              {loading ? 'Sharing...' : 'Share Customer'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
} 