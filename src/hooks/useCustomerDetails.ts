import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Customer } from '@/types/customer';

interface EditableField {
  name: string;
  value: string;
  isEditing: boolean;
  error?: string;
}

export function useCustomerDetails(customerId: string) {
  const { data: session } = useSession();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editableFields, setEditableFields] = useState<EditableField[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!session?.user?.id) return;

      try {
        const customerRef = doc(db, 'customers', customerId);
        const customerSnap = await getDoc(customerRef);

        if (!customerSnap.exists()) {
          setError('Customer not found');
          return;
        }

        const customerData = customerSnap.data() as Customer;
        setCustomer(customerData);
        
        setEditableFields([
          { name: 'name', value: customerData.name, isEditing: false },
          { name: 'email', value: customerData.email, isEditing: false },
          { name: 'phone', value: customerData.phone || '', isEditing: false }
        ]);
      } catch (err) {
        console.error('Error fetching customer:', err);
        setError('Failed to load customer details');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchCustomer();
    }
  }, [customerId, session?.user?.id]);

  const validateField = (fieldName: string, value: string): string | undefined => {
    if (fieldName === 'name' && !value.trim()) {
      return 'Name is required';
    }
    if (fieldName === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Invalid email format';
    }
    if (fieldName === 'phone' && value && value.trim() && !/^[0-9()\-\s+]+$/.test(value)) {
      return 'Phone number can only contain numbers, spaces, dashes, and parentheses';
    }
    return undefined;
  };

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return value;
    
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const updateField = async (fieldName: string, value: string) => {
    if (!customer) return;

    const error = validateField(fieldName, value);
    if (error) {
      setEditableFields(fields =>
        fields.map(f =>
          f.name === fieldName
            ? { ...f, error }
            : f
        )
      );
      return false;
    }

    try {
      setIsSaving(true);
      const customerRef = doc(db, 'customers', customerId);
      await updateDoc(customerRef, {
        [fieldName]: value,
        updatedAt: new Date()
      });

      setCustomer(prev => prev ? { ...prev, [fieldName]: value } : null);
      setEditableFields(fields =>
        fields.map(f =>
          f.name === fieldName
            ? { ...f, isEditing: false, error: undefined }
            : f
        )
      );
      return true;
    } catch (err) {
      console.error('Error updating customer:', err);
      setError('Failed to update customer');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCustomer = async () => {
    if (!customer) return false;
    
    try {
      setIsSaving(true);
      const customerRef = doc(db, 'customers', customerId);
      await deleteDoc(customerRef);
      return true;
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError('Failed to delete customer');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    customer,
    loading,
    error,
    editableFields,
    isSaving,
    isOwner: customer?.primaryOwnerId === session?.user?.id,
    updateField,
    deleteCustomer,
    formatPhoneNumber,
    setEditableFields
  };
} 