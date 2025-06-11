'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log('AuthProvider: Setting up auth state listener');
    
    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // console.log('AuthProvider: Auth state changed', { 
      //   user: user?.uid, 
      //   email: user?.email 
      // });
      
      if (user) {
        try {
          // Get a fresh token
          const token = await user.getIdToken(true);
          
          // Log token details
          const tokenResult = await user.getIdTokenResult();
          // console.log('AuthProvider: Token Details', {
          //   uid: user.uid,
          //   email: user.email,
          //   claims: tokenResult.claims,
          //   expirationTime: tokenResult.expirationTime,
          //   authTime: tokenResult.authTime,
          //   issuedAtTime: tokenResult.issuedAtTime
          // });

          // Set the token in a cookie
          document.cookie = `auth-token=${token}; path=/; secure; samesite=lax`;
          // console.log('AuthProvider: Updated auth token in cookies');
        } catch (error) {
          console.error('AuthProvider: Error refreshing token:', error);
          // Clear invalid token
          document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      } else {
        // Clear tokens when user is null
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      
      setUser(user);
      setLoading(false);
    });

    return () => {
      // console.log('AuthProvider: Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 