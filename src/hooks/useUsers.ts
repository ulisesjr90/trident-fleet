import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp, where, doc, setDoc, limit } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
// import { setUserRole } from '@/lib/firebase-admin';

const USERS_PER_PAGE = 50;

export interface User {
  id: string;
  displayName: string;
  email: string;
  role: 'admin' | 'rep';
  status: 'active' | 'inactive';
  invitedAt: Date;
  lastLoginAt: Date | null;
  updatedAt: Date;
  photoURL?: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();
  const { user: currentUser, isAdmin } = useAuth();

  // Fetch users
  const fetchUsers = async (lastDoc?: any) => {
    try {
      setLoading(true);
      setError(null);
      const usersRef = collection(db, 'users');
      
      // For admins, fetch all users
      // For reps, only fetch other reps
      const q = isAdmin 
        ? query(
            usersRef,
            orderBy('invitedAt', 'desc'),
            limit(USERS_PER_PAGE),
            ...(lastDoc ? [where('invitedAt', '<', lastDoc.invitedAt)] : [])
          )
        : query(
            usersRef,
            where('role', '==', 'rep'),
            orderBy('invitedAt', 'desc'),
            limit(USERS_PER_PAGE),
            ...(lastDoc ? [where('invitedAt', '<', lastDoc.invitedAt)] : [])
          );
      
      const querySnapshot = await getDocs(q);
      
      const usersData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        // Helper function to safely convert timestamps
        const convertTimestamp = (timestamp: any): Date | null => {
          if (!timestamp) return null;
          if (timestamp.toDate) return timestamp.toDate();
          if (timestamp instanceof Date) return timestamp;
          if (typeof timestamp === 'string') return new Date(timestamp);
          if (typeof timestamp === 'number') return new Date(timestamp);
          return null;
        };

        return {
          id: doc.id,
          displayName: data.displayName || data.email?.split('@')[0] || 'Unnamed User',
          email: data.email || '',
          role: data.role || 'rep',
          status: data.status || 'active',
          invitedAt: convertTimestamp(data.invitedAt) || new Date(),
          lastLoginAt: convertTimestamp(data.lastLoginAt),
          updatedAt: convertTimestamp(data.updatedAt) || new Date(),
          photoURL: data.photoURL || undefined
        };
      });
      
      setUsers(prev => lastDoc ? [...prev, ...usersData] : usersData);
      setHasMore(querySnapshot.docs.length === USERS_PER_PAGE);
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

  const loadMore = async () => {
    if (!hasMore || loading) return;
    const lastUser = users[users.length - 1];
    if (lastUser) {
      await fetchUsers(lastUser);
    }
  };

  // Invite new user
  const inviteUser = async (email: string, role: 'admin' | 'rep' = 'rep') => {
    try {
      setError(null);
      
      // Only admins can invite other admins
      if (role === 'admin' && !isAdmin) {
        setError('Only administrators can invite other administrators');
        toast({
          title: 'Error',
          description: 'Only administrators can invite other administrators',
          variant: 'destructive'
        });
        return false;
      }

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

      // Create user document in Firestore
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, {
        email,
        displayName: email.split('@')[0], // Default display name from email
        role,
        status: 'active',
        invitedAt: serverTimestamp(),
        lastLoginAt: null,
        updatedAt: serverTimestamp()
      });

      // Set custom claims for users
      try {
        const response = await fetch('/api/auth/set-role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user.uid,
            role: role
          }),
        });

        const responseData = await response.json();

        if (!response.ok || !responseData.success) {
          console.error('Failed to set user role', responseData);
          throw new Error(responseData.error || 'Failed to set user role');
        }

        console.log('User role set successfully', responseData);
      } catch (error) {
        console.error(`Error setting ${role} role:`, error);
        // Continue with the process even if setting custom claims fails
        // The user can still have a role in Firestore
      }

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
  }, [isAdmin]);

  return {
    users,
    loading,
    error,
    hasMore,
    loadMore,
    inviteUser,
    refreshUsers: () => fetchUsers()
  };
} 