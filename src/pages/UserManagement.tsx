import React, { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, Search } from 'lucide-react';
import { Button, PageHeader } from '../components/common';
import { UserModal } from '../components/modals/UserModal';
import { userService, type FirestoreUser } from '../services/userService';
import { formatDistanceToNow } from 'date-fns';
import { UserRole } from '../types/user';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<FirestoreUser | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const fetchedUsers = await userService.getAllUsers();
      setUsers(fetchedUsers);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(undefined);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditUser = (user: FirestoreUser) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await userService.deleteUser(userId);
      setUsers(users.filter(user => user.uid !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  const handleUserSubmit = async (userData: Partial<FirestoreUser>) => {
    try {
      if (modalMode === 'create') {
        // In a real app, you'd create the Firebase Auth user first
        const tempUid = 'temp-' + Date.now(); // This should come from Firebase Auth
        const newUser = await userService.createUser({
          ...userData as Omit<FirestoreUser, 'createdAt' | 'lastLogin'>,
          uid: tempUid
        });
        setUsers([...users, newUser]);
      } else if (selectedUser) {
        await userService.updateUser(selectedUser.uid, userData);
        setUsers(users.map(user => 
          user.uid === selectedUser.uid 
            ? { ...user, ...userData }
            : user
        ));
      }
    } catch (err) {
      console.error('Error saving user:', err);
      throw new Error('Failed to save user');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const addUserButton = (
    <Button
      onClick={handleAddUser}
      className="flex items-center gap-2"
    >
      <UserPlus className="w-4 h-4" />
      Add User
    </Button>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        action={addUserButton}
      />

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full
                pl-10
                pr-4
                py-2
                border
                border-gray-300
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-transparent
              "
            />
          </div>
        </div>

        {error ? (
          <div className="p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${user.role === UserRole.ADMIN ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
                      `}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      `}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {user.lastLogin 
                          ? formatDistanceToNow(user.lastLogin.toDate(), { addSuffix: true })
                          : 'Never'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.uid)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUserSubmit}
        user={selectedUser}
        mode={modalMode}
      />
    </div>
  );
};

export default UserManagement; 