import { useState } from 'react';
import { User } from '@/hooks/useUsers';
import { getTypographyClass } from '@/lib/typography';

interface UserSelectProps {
  users: User[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function UserSelect({ users, value, onChange, error }: UserSelectProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="user" className={getTypographyClass('body')}>
        Select User
      </label>
      <select
        id="user"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
      >
        <option value="">Select a user...</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.displayName} ({user.email})
          </option>
        ))}
      </select>
      {error && (
        <p className={getTypographyClass('body')}>{error}</p>
      )}
    </div>
  );
} 