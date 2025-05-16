import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface AddCustomerModalProps {
  onClose: () => void;
  onSuccess: (customer: any) => void;
}

export function AddCustomerModal({ onClose, onSuccess }: AddCustomerModalProps) {
  const { data: session } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      setError('Please sign in to add customers');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const customerData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        primaryOwnerId: session.user.id,
        additionalOwnerIds: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'customers'), customerData);
      
      onSuccess({
        id: docRef.id,
        ...customerData
      });
    } catch (err: any) {
      console.error('Error adding customer:', err);
      if (err.code === 'permission-denied') {
        setError('You do not have permission to add customers. Please contact your administrator.');
      } else {
        setError('Failed to add customer. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Add Customer" onClose={onClose}>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="form-group">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Customer's full name"
              />
            </div>
            
            <div className="form-group">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
              />
            </div>
            
            <div className="form-group">
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 555-5555"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="accent"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !name.trim()}
            >
              {loading ? 'Adding...' : 'Add Customer'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
} 