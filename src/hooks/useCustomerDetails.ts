import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import { Customer } from '@/types/customer';
import { VehicleStatus } from '@/types/vehicle';

interface EditableField {
  name: string;
  value: string;
  isEditing: boolean;
  error?: string;
}

export function useCustomerDetails(customerId: string) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [editableFields, setEditableFields] = useState<EditableField[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setCustomer(null);
          setLoading(false);
          return;
        }

        const customerRef = doc(db, 'customers', customerId);
        const customerDoc = await getDoc(customerRef);

        if (customerDoc.exists()) {
          // Get assigned vehicles from vehicles collection
          const vehiclesRef = collection(db, 'vehicles');
          const vehiclesQuery = query(
            vehiclesRef, 
            where('customerId', '==', customerId),
            where('status', '==', VehicleStatus.WithCustomer)
          );
          const vehiclesSnapshot = await getDocs(vehiclesQuery);
          
          // Get the customer data
          const customerData = customerDoc.data();
          
          // Get unique vehicles from the customer's vehicles array
          const uniqueVehicles = new Map();
          customerData.vehicles?.forEach((vehicle: any) => {
            if (!uniqueVehicles.has(vehicle.id)) {
              uniqueVehicles.set(vehicle.id, vehicle);
            }
          });

          // Map the vehicles from the vehicles collection
          const assignedVehicles = vehiclesSnapshot.docs.map(doc => {
            const vehicleData = doc.data();
            return {
              id: doc.id,
              vehicleDescriptor: vehicleData.vehicleDescriptor,
              assignedAt: vehicleData.updatedAt,
              assignedBy: {
                id: user.uid,
                name: user.displayName || 'Unknown User'
              },
              status: VehicleStatus.WithCustomer
            };
          });

          // Merge unique vehicles from both sources
          const mergedVehicles = Array.from(uniqueVehicles.values());
          const finalVehicles = [...mergedVehicles, ...assignedVehicles].filter((vehicle, index, self) =>
            index === self.findIndex((v) => v.id === vehicle.id)
          );

          setCustomer({ 
            id: customerDoc.id, 
            ...customerData,
            vehicles: finalVehicles,
            assignedVehicles: finalVehicles.length
          } as Customer);
          
          setEditableFields([
            { name: 'name', value: customerData?.name || '', isEditing: false },
            { name: 'email', value: customerData?.email || '', isEditing: false },
            { name: 'phone', value: customerData?.phone || '', isEditing: false }
          ]);
        } else {
          setCustomer(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch customer details'));
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]);

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
      const customerRef = doc(db, 'customers', customer.id);
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
      setError(err instanceof Error ? err : new Error('Failed to update customer'));
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCustomer = async () => {
    if (!customer) return false;
    
    try {
      setIsSaving(true);
      const customerRef = doc(db, 'customers', customer.id);
      await deleteDoc(customerRef);
      return true;
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete customer'));
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
    isOwner: customer?.primaryOwnerId === auth.currentUser?.uid,
    updateField,
    deleteCustomer,
    formatPhoneNumber,
    setEditableFields
  };
} 