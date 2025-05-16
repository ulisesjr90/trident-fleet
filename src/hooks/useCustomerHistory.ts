import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface HistoryItem {
  id: string;
  type: 'update' | 'share' | 'vehicle' | 'note';
  description: string;
  timestamp: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export function useCustomerHistory(customerId: string) {
  const { data: session } = useSession();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!session?.user?.id || !customerId) {
        setLoading(false);
        return;
      }

      try {
        const historyRef = collection(db, 'customerHistory');
        const q = query(
          historyRef,
          where('customerId', '==', customerId),
          orderBy('timestamp', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const historyData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate()
        })) as HistoryItem[];

        setHistory(historyData);
      } catch (err) {
        console.error('Error fetching customer history:', err);
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [customerId, session?.user?.id]);

  const addHistoryItem = async (type: HistoryItem['type'], description: string) => {
    if (!session?.user?.id || !session?.user?.name || !session?.user?.email || !customerId) {
      throw new Error('Missing required user data or customer ID');
    }

    try {
      const historyRef = collection(db, 'customerHistory');
      await addDoc(historyRef, {
        customerId,
        type,
        description,
        timestamp: serverTimestamp(),
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email
        }
      });

      // Refresh history
      const q = query(
        historyRef,
        where('customerId', '==', customerId),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const historyData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as HistoryItem[];

      setHistory(historyData);
    } catch (err) {
      console.error('Error adding history item:', err);
      throw new Error('Failed to add history item');
    }
  };

  return {
    history,
    loading,
    error,
    addHistoryItem
  };
} 