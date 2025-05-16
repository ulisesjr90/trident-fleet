import { useState } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/types/user';

export function useShareCustomer(customerId: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', 'rep'));
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    }
  };

  const shareCustomer = async (selectedUserId: string) => {
    if (!selectedUserId) return false;
    
    try {
      setLoading(true);
      setError(null);
      const customerRef = doc(db, 'customers', customerId);
      await updateDoc(customerRef, {
        additionalOwnerIds: arrayUnion(selectedUserId),
        updatedAt: new Date()
      });
      return true;
    } catch (err) {
      console.error('Error sharing customer:', err);
      setError('Failed to share customer');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    shareCustomer
  };
} 