import { useState } from 'react';
import { collection, addDoc, updateDoc, doc, deleteDoc, arrayUnion, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import { Customer, CustomerHistory } from '@/types/customer';

interface CustomerData {
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
}

export function useCustomerOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addCustomer = async (customerData: CustomerData) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const docRef = await addDoc(collection(db, 'customers'), {
        ...customerData,
        primaryOwnerId: user.uid,
        additionalOwnerIds: [],
        vehicles: [],
        history: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Add initial history entry
      const historyEntry: CustomerHistory = {
        id: docRef.id,
        customerId: docRef.id,
        type: 'update',
        description: 'Customer created',
        timestamp: new Date(),
        user: {
          id: user.uid,
          name: user.displayName || 'Unknown User',
          email: user.email || 'unknown@email.com'
        }
      };

      await updateDoc(docRef, {
        history: arrayUnion(historyEntry)
      });

      return docRef.id;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add customer'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const customerRef = doc(db, 'customers', id);
      await updateDoc(customerRef, {
        ...customerData,
        updatedAt: serverTimestamp()
      });

      // Add history entry for the update
      const historyEntry: CustomerHistory = {
        id: id,
        customerId: id,
        type: 'update',
        description: 'Customer information updated',
        timestamp: new Date(),
        user: {
          id: user.uid,
          name: user.displayName || 'Unknown User',
          email: user.email || 'unknown@email.com'
        }
      };

      await updateDoc(customerRef, {
        history: arrayUnion(historyEntry)
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update customer'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const assignVehicle = async (customerId: string, vehicleId: string, vehicleDescriptor: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const customerRef = doc(db, 'customers', customerId);
      const customerDoc = await getDoc(customerRef);
      
      if (!customerDoc.exists()) {
        throw new Error('Customer not found');
      }

      const customerData = customerDoc.data();
      const existingVehicles = customerData.vehicles || [];
      
      // Check if vehicle is already assigned
      const isAlreadyAssigned = existingVehicles.some((v: any) => v.id === vehicleId);
      if (isAlreadyAssigned) {
        throw new Error('Vehicle is already assigned to this customer');
      }

      const vehicleAssignment = {
        id: vehicleId,
        vehicleDescriptor,
        status: 'WithCustomer',
        assignedAt: new Date(),
        assignedBy: {
          id: user.uid,
          name: user.displayName || 'Unknown User'
        }
      };

      // Add vehicle to customer's vehicles array
      await updateDoc(customerRef, {
        vehicles: arrayUnion(vehicleAssignment),
        updatedAt: serverTimestamp()
      });

      // Add history entry for vehicle assignment
      const historyEntry = {
        id: customerId,
        customerId,
        type: 'vehicle',
        description: `Vehicle ${vehicleDescriptor} assigned to customer`,
        timestamp: new Date(),
        user: {
          id: user.uid,
          name: user.displayName || 'Unknown User',
          email: user.email || 'unknown@email.com'
        },
        metadata: {
          vehicleId,
          vehicleDescriptor
        }
      };

      await updateDoc(customerRef, {
        history: arrayUnion(historyEntry)
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to assign vehicle'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const customerRef = doc(db, 'customers', id);
      await deleteDoc(customerRef);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete customer'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addCustomer,
    updateCustomer,
    assignVehicle,
    deleteCustomer,
    isLoading,
    error
  };
} 