import { useState } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import { ShareCustomerModalProps } from '@/types/customer';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getTypographyClass } from '@/lib/typography';

export function ShareCustomerModal({ customer, onClose, onSuccess }: ShareCustomerModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('You must be logged in to share a customer');
      }

      if (customer.additionalOwnerIds.includes(email)) {
        throw new Error('This user already has access to this customer');
      }

      const customerRef = doc(db, 'customers', customer.id);
      await updateDoc(customerRef, {
        additionalOwnerIds: arrayUnion(email)
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className={getTypographyClass('header')}>Share Customer</h2>
        <p className={`mt-2 ${getTypographyClass('body')}`}>
          Share {customer.name} with another user by entering their email address.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
            <label htmlFor="email" className={getTypographyClass('body')}>
              Email Address
          </label>
            <input
              type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="user@example.com"
            required
          />
        </div>

        {error && (
            <div className={getTypographyClass('body')}>
              {error}
            </div>
        )}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
            <Button type="submit" disabled={isSubmitting}>
              Share
          </Button>
        </div>
      </form>
      </div>
    </div>
  );
} 