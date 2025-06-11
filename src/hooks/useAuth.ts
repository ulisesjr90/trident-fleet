import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User, signOut as firebaseSignOut, updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTheme } from 'next-themes';
import { User as UserType, UserPreferences } from '@/types/user';

interface ExtendedAuthUser extends User {
  role?: 'admin' | 'rep';
  preferences?: UserPreferences;
}

export function useAuth() {
  const [user, setUser] = useState<ExtendedAuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { setTheme } = useTheme();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data() as UserType;
          
          // Sync display name from Firestore to Firebase Auth if needed
          if (userData?.displayName && !firebaseUser.displayName) {
            await firebaseUpdateProfile(firebaseUser, { displayName: userData.displayName });
          }
          
          console.log('AUTH_USER_DEBUG', {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            firestoreData: userData
          });
          
          // Get the ID token to check custom claims
          const idTokenResult = await firebaseUser.getIdToken(true);
          const tokenResult = await firebaseUser.getIdTokenResult();
          
          // Explicit role detection with comprehensive logging
          const customRole = tokenResult.claims.role;
          const firestoreRole = userData?.role;
          
          console.log('AUTH_ROLE_DEBUG', {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            customRole,
            firestoreRole,
            tokenClaims: tokenResult.claims
          });
          
          // Determine role with clear precedence
          const role = (customRole === 'admin' || firestoreRole === 'admin') 
            ? 'admin' 
            : 'rep';
          
          const authUser = {
            ...firebaseUser,
            role: role as 'admin' | 'rep',
            preferences: userData?.preferences || {
              theme: 'system',
              notifications: {
                email: true,
                push: true,
                inApp: true
              },
              language: 'en',
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
          };

          // Set theme based on user preferences
          if (authUser.preferences?.theme) {
            setTheme(authUser.preferences.theme);
          }

          // Update last login
          await updateDoc(doc(db, 'users', firebaseUser.uid), {
            lastLoginAt: new Date(),
            updatedAt: new Date(),
            role: authUser.role // Ensure Firestore role matches custom claims
          });

          setUser(authUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user data'));
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setTheme]);

  const updatePreferences = async (preferences: Partial<UserPreferences>): Promise<boolean> => {
    if (!user) return false;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        preferences: {
          ...user.preferences,
          ...preferences
        },
        updatedAt: new Date()
      });

      // Update local state
      setUser(prev => prev ? {
        ...prev,
        preferences: {
          ...prev.preferences,
          ...preferences
        }
      } : null);

      // Update theme if changed
      if (preferences.theme) {
        setTheme(preferences.theme);
      }

      return true;
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError(err as Error);
      return false;
    }
  };

  const signOut = async () => {
    const auth = getAuth();
    await firebaseSignOut(auth);
  };

  const isAdmin = user?.role === 'admin';

  return { user, loading, error, updatePreferences, signOut, isAdmin };
} 