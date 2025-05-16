import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp, where, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';
import { setUserRole } from '@/lib/firebase-admin';

export interface User {
  id: string;
  displayName: string;
  email: string;
  role: 'admin' | 'rep';
  createdAt: Date;
  updatedAt: Date;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        displayName: doc.data().displayName || doc.data().email?.split('@')[0] || 'Unnamed User',
        email: doc.data().email || '',
        role: doc.data().role || 'rep',
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      }));
      
      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to fetch users. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Invite new user
  const inviteUser = async (email: string, role: 'admin' | 'rep' = 'rep') => {
    try {
      setError(null);
      const usersRef = collection(db, 'users');
      
      // Check if user already exists
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setError('User with this email already exists');
        toast({
          title: 'Error',
          description: 'User with this email already exists',
          variant: 'destructive'
        });
        return false;
      }

      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-8);

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, tempPassword);
      const user = userCredential.user;

      // Set user role in Firebase Auth custom claims
      const roleSet = await setUserRole(user.uid, role);
      if (!roleSet) {
        throw new Error('Failed to set user role');
      }

      // Create user document in Firestore
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, {
        email,
        displayName: email.split('@')[0], // Default display name from email
        role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Send password reset email
      await sendPasswordResetEmail(auth, email);

      toast({
        title: 'Success',
        description: 'User invited successfully. A password reset email has been sent.',
      });

      // Refresh users list
      await fetchUsers();
      return true;
    } catch (err) {
      console.error('Error inviting user:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to invite user. Please try again.';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    inviteUser,
    refreshUsers: fetchUsers
  };
} 