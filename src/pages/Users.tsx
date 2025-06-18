import React, { useState, useEffect } from 'react';
import { UserRole } from '@/types/user';
import DataTable from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { userService, type FirestoreUser } from '@/services/userService';
import { ActionsMenu, type Action } from '@/components/common/ActionsMenu';

export default function Users() {
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.getAllUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChangeRole = async (user: FirestoreUser, newRole: UserRole) => {
    try {
      await userService.updateUser(user.uid, { role: newRole });
      setUsers(users.map(u => 
        u.uid === user.uid ? { ...u, role: newRole } : u
      ));
    } catch (err) {
      console.error('Error updating user role:', err);
      // You might want to show an error message to the user
    }
  };

  const handleToggleActive = async (user: FirestoreUser) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await userService.updateUser(user.uid, { status: newStatus });
      setUsers(users.map(u => 
        u.uid === user.uid ? { ...u, status: newStatus } : u
      ));
    } catch (err) {
      console.error('Error updating user status:', err);
      // You might want to show an error message to the user
    }
  };

  const handleDelete = async (user: FirestoreUser) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await userService.deleteUser(user.uid);
      setUsers(users.filter(u => u.uid !== user.uid));
    } catch (err) {
      console.error('Error deleting user:', err);
      // You might want to show an error message to the user
    }
  };

  const getActions = (user: FirestoreUser): Action[] => [
    {
      label: `Change Role to ${user.role === UserRole.ADMIN ? 'Rep' : 'Admin'}`,
      onClick: () => handleChangeRole(user, user.role === UserRole.ADMIN ? UserRole.REP : UserRole.ADMIN),
    },
    {
      label: `${user.status === 'active' ? 'Deactivate' : 'Activate'} User`,
      onClick: () => handleToggleActive(user),
    },
    {
      label: 'Delete User',
      onClick: () => handleDelete(user),
      className: 'text-red-600',
    },
  ];

  const columns = [
    {
      header: 'Name',
      accessor: (user: FirestoreUser) => user.name,
    },
    {
      header: 'Email',
      accessor: (user: FirestoreUser) => user.email,
    },
    {
      header: 'Role',
      accessor: (user: FirestoreUser) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {user.role === UserRole.ADMIN ? 'Admin' : 'Rep'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (user: FirestoreUser) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {user.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Last Login',
      accessor: (user: FirestoreUser) => user.lastLogin ? user.lastLogin.toDate().toLocaleDateString() : 'Never',
    },
    {
      header: '',
      accessor: (user: FirestoreUser) => (
        <ActionsMenu actions={getActions(user)} />
      ),
      className: 'w-px',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="primary">Add User</Button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm">
        <DataTable
          columns={columns}
          data={users}
          emptyMessage="No users found"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
} 