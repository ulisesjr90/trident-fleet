import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import { CustomerHistory } from '@/types/customer';

const HISTORY_PER_PAGE = 20;

export function useCustomerHistory(customerId: string) {
  const [history, setHistory] = useState<CustomerHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchHistory = async (lastDoc?: any) => {
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
        orderBy('timestamp', 'desc'),
        limit(HISTORY_PER_PAGE),
        ...(lastDoc ? [where('timestamp', '<', lastDoc.timestamp)] : [])
      );
      
      const querySnapshot = await getDocs(q);
      const historyData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CustomerHistory[];

      setHistory(prev => lastDoc ? [...prev, ...historyData] : historyData);
      setHasMore(querySnapshot.docs.length === HISTORY_PER_PAGE);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch customer history'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchHistory();
    }
  }, [customerId]);

  const loadMore = async () => {
    if (!hasMore || loading) return;
    const lastEntry = history[history.length - 1];
    if (lastEntry) {
      await fetchHistory(lastEntry);
    }
  };

  return { history, loading, error, hasMore, loadMore };
} 