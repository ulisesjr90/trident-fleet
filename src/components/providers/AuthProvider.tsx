'use client';

import { AuthProvider as FirebaseAuthProvider } from '@/lib/auth-context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <FirebaseAuthProvider>{children}</FirebaseAuthProvider>;
} 