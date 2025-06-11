import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, onSnapshot, or } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Customer } from '@/types/customer';
import { useAuth } from '@/hooks/useAuth';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (!user) {
      setCustomers([]);
      setLoading(false);
      return;
    }

    const customersRef = collection(db, 'customers');
    let q;
    if (isAdmin) {
      q = query(customersRef);
    } else {
      // Show customers where user is primaryOwnerId or in additionalOwnerIds
      q = query(
        customersRef,
        or(
          where('primaryOwnerId', '==', user.uid),
          where('additionalOwnerIds', 'array-contains', user.uid)
        )
      );
    }

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        const customersData = await Promise.all(snapshot.docs.map(async doc => {
          const data = doc.data();
          // Get assigned vehicles count
          const vehiclesRef = collection(db, 'vehicles');
          const vehiclesQuery = query(vehiclesRef, where('customerId', '==', doc.id));
          const vehiclesSnapshot = await getDocs(vehiclesQuery);
          const assignedVehicles = vehiclesSnapshot.size;

          return {
            id: doc.id,
            name: data.name || 'Unnamed Customer',
            email: data.email || '',
            phone: data.phone || '',
            primaryOwnerId: data.primaryOwnerId || user.uid,
            additionalOwnerIds: data.additionalOwnerIds || [],
            assignedVehicles,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          };
        }));

        setCustomers(customersData);
        setError(null);
      } catch (err) {
        console.error('Error processing customers:', err);
        setError(err instanceof Error ? err : new Error('Failed to process customers'));
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user, isAdmin]);

  return { customers, loading, error };
} 