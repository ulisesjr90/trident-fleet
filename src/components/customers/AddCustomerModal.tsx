import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCustomerOperations } from '@/hooks/useCustomerOperations';
import { getTypographyClass } from '@/lib/typography';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (customer: { id: string; name: string }) => void;
}

export function AddCustomerModal({ isOpen, onClose, onSuccess }: AddCustomerModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const { addCustomer, isLoading, error } = useCustomerOperations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Name is required');
      return;
    }

    try {
      const customerId = await addCustomer({
        name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        address: address.trim() || null,
        notes: notes.trim() || null,
      });

      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setNotes('');
      setFormError(null);

      onSuccess?.({ id: customerId, name: name.trim() });
      onClose();
    } catch (err) {
      console.error('Error adding customer:', err);
      setFormError('Failed to add customer. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto my-auto">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <div className="p-3 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
          {(error || formError) && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-2 rounded-md">
              <p className={getTypographyClass('body')}>
                {formError || error?.message}
              </p>
            </div>
          )}

          <div className="space-y-4">
        <div>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
                placeholder="Customer Name *"
            required
                  autoFocus
          />
        </div>

        <div>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
          />
        </div>

        <div>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
              />
            </div>

            <div>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
              />
            </div>

            <div>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes"
          />
        </div>
          </div>
          </form>
        </div>
        <DialogFooter>
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
            onClick={handleSubmit}
          >
              {isLoading ? 'Adding...' : 'Add Customer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 