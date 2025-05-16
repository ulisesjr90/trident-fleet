export interface User {
  id: string;
  name: string;
  email: string;
  role: 'rep' | 'admin';
}

export interface UserSelectProps {
  users: User[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
} 