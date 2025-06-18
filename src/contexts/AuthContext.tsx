import React, { createContext, useState, useContext, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { firebaseAuth } from '../config/firebase';
import { UserRole } from '../types/user';
import { userService } from '../services/userService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(UserRole.REP);
  const [isLoading, setIsLoading] = useState(true);

  const createOrUpdateUserDoc = async (currentUser: User, userRole: UserRole) => {
    try {
      // First check if user exists
      const existingUser = await userService.getUserById(currentUser.uid);
      
      if (existingUser) {
        // User exists, update last login and use their existing role
        await userService.updateLastLogin(currentUser.uid);
        return existingUser.role;
      } else {
        // User doesn't exist, create new user document
        const newUser = await userService.createUser({
          uid: currentUser.uid,
          email: currentUser.email || '',
          name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Unknown User',
          role: userRole,
          status: 'active'
        });
        return newUser.role;
      }
    } catch (error) {
      console.error('Error managing user document:', error);
      return userRole; // Fallback to the default role
    }
  };

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthChange(async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Default role based on email (fallback)
        const defaultRole = currentUser.email?.includes('admin') 
          ? UserRole.ADMIN 
          : UserRole.REP;
        
        // Get actual role from Firestore
        const actualRole = await createOrUpdateUserDoc(currentUser, defaultRole);
        setRole(actualRole);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const loggedInUser = await firebaseAuth.signIn(email, password);
      setUser(loggedInUser);
      
      // Default role based on email (fallback)
      const defaultRole = email.includes('admin') 
        ? UserRole.ADMIN 
        : UserRole.REP;
      
      // Get actual role from Firestore
      const actualRole = await createOrUpdateUserDoc(loggedInUser, defaultRole);
      setRole(actualRole);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (user) {
      try {
        setIsLoading(true);
        await firebaseAuth.signOutUser();
        setUser(null);
        setRole(UserRole.REP);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    role,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 