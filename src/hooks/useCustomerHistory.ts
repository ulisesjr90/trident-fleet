import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import { CustomerHistory } from '@/types/customer';

export function useCustomerHistory(customerId: string) {
  const [history, setHistory] = useState<CustomerHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCustomerHistory = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setHistory([]);
          setLoading(false);
          return;
        }

        const historyRef = collection(db, 'customerHistory');
        const q = query(
          historyRef,
          where('customerId', '==', customerId),
          orderBy('timestamp', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const historyData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CustomerHistory[];

        setHistory(historyData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch customer history'));
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomerHistory();
    }
  }, [customerId]);

  return { history, loading, error };
} 