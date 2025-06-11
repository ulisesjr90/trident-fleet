import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  displayName: string;
  email: string;
  role: 'admin' | 'rep';
  status: 'active' | 'inactive';
  invitedAt: Timestamp;
  lastLoginAt: Timestamp | null;
  updatedAt: Timestamp;
  photoURL?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  language: string;
  timezone: string;
}

export interface UserSelectProps {
  users: User[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
} 