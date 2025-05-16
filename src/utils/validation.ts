import { User } from '@/types/user';
 
export const validateUserSelection = (userId: string, users: User[]): string | null => {
  if (!userId) return 'Please select a user';
  if (!users.find(u => u.id === userId)) return 'Invalid user selected';
  return null;
}; 