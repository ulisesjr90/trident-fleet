'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MoreHorizontal, ChevronUp, ChevronDown, Filter, X, Trash2, UserMinus, UserPlus, Shield, ShieldOff, Check, X as XIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { InviteUserModal } from '@/components/users/InviteUserModal';
import { useUsers, User } from '@/hooks/useUsers';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PageHeader } from '@/components/layout/PageHeader';
import { getTypographyClass } from '@/lib/typography';
import { DataTable, DataTableHeader, DataTableBody, DataTableRow, DataTableCell, DataTableHeaderCell } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Timestamp } from 'firebase/firestore';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/Input';
import { PageLayout } from '@/components/layout/PageLayout';

type SortField = 'displayName' | 'email' | 'role' | 'status' | 'invitedAt';
type SortDirection = 'asc' | 'desc';
type FilterField = 'role' | 'status';

const isTimestamp = (value: any): value is Timestamp => {
  return value && typeof value.toDate === 'function';
};

const getStatusVariant = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus === 'active') return 'success';
  if (normalizedStatus === 'inactive') return 'error';
  return 'default';
};

export default function UsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { users, loading: isLoading, error, refreshUsers } = useUsers();
  const [sortField, setSortField] = useState<SortField>('displayName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [activeFilters, setActiveFilters] = useState(0);
  const [filters, setFilters] = useState<{
    role?: 'admin' | 'rep';
    status?: 'active' | 'inactive';
  }>({});
  const [editingUser, setEditingUser] = useState<{ id: string; field: 'displayName' | 'email' } | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInviteSuccess = () => {
    setShowInviteModal(false);
  };

  const handleSort = (field: SortField) => {
    setSortField(field);
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const filteredAndSortedUsers = useMemo(() => {
    if (!users) return [];
    return [...users]
      .filter(user => {
        if (filters.role && user.role !== filters.role) return false;
        if (filters.status && user.status !== filters.status) return false;
        return true;
      })
      .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'displayName':
          return direction * (a.displayName?.localeCompare(b.displayName || '') || 0);
        case 'email':
          return direction * (a.email?.localeCompare(b.email || '') || 0);
        case 'role':
          return direction * (a.role?.localeCompare(b.role || '') || 0);
        case 'status':
          return direction * (a.status?.localeCompare(b.status || '') || 0);
        case 'invitedAt':
          const aDate = a.invitedAt instanceof Date ? a.invitedAt : new Date(0);
          const bDate = b.invitedAt instanceof Date ? b.invitedAt : new Date(0);
          return direction * (aDate.getTime() - bDate.getTime());
        default:
          return 0;
      }
    });
  }, [users, sortField, sortDirection, filters]);

  const handleFilterChange = (field: FilterField, value: 'admin' | 'rep' | 'active' | 'inactive' | undefined) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (value === undefined) {
        delete newFilters[field];
      } else if (field === 'role') {
        newFilters.role = value as 'admin' | 'rep';
      } else if (field === 'status') {
        newFilters.status = value as 'active' | 'inactive';
      }
      return newFilters;
    });
  };

  // Update activeFilters count whenever filters change
  useEffect(() => {
    setActiveFilters(Object.keys(filters).length);
  }, [filters]);

  // Focus input when editing starts
  useEffect(() => {
    if (editingUser && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingUser]);

  const handleStartEdit = (user: User, field: 'displayName' | 'email') => {
    setEditingUser({ id: user.id, field });
    setEditValue(user[field]);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditValue('');
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    const user = users.find(u => u.id === editingUser.id);
    if (!user) return;

    // Don't save if value hasn't changed
    if (user[editingUser.field] === editValue) {
      handleCancelEdit();
      return;
    }

    try {
      await updateDoc(doc(db, 'users', editingUser.id), {
        [editingUser.field]: editValue,
        updatedAt: new Date(),
      });
      await refreshUsers();
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user. Please try again.',
        variant: 'destructive',
      });
    }
    handleCancelEdit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleDelete = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.displayName}?`)) {
      try {
        await deleteDoc(doc(db, 'users', user.id));
        await refreshUsers(); // Refresh the users list after deletion
        toast({
          title: 'Success',
          description: 'User deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete user. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    if (window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} ${user.displayName}?`)) {
      try {
        await updateDoc(doc(db, 'users', user.id), {
          status: newStatus,
          updatedAt: new Date(),
        });
        await refreshUsers(); // Refresh the users list after status change
        toast({
          title: 'Success',
          description: `User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
        });
      } catch (error) {
        console.error('Error toggling user status:', error);
        toast({
          title: 'Error',
          description: 'Failed to update user status. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleToggleRole = async (user: User) => {
    const newRole = user.role === 'admin' ? 'rep' : 'admin';
    if (window.confirm(`Are you sure you want to change ${user.displayName}'s role to ${newRole}?`)) {
      try {
        await updateDoc(doc(db, 'users', user.id), {
          role: newRole,
          updatedAt: new Date(),
        });
        await refreshUsers(); // Refresh the users list after role change
        toast({
          title: 'Success',
          description: `User role updated to ${newRole} successfully`,
        });
      } catch (error) {
        console.error('Error toggling user role:', error);
        toast({
          title: 'Error',
          description: 'Failed to update user role. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  if (isLoading) {
    return (
      <PageLayout title="Users">
        <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Users">
        <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
          <p className={getTypographyClass('body')}>
        Error loading users: {error}
          </p>
      </div>
      </PageLayout>
    );
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  return (
    <PageLayout 
      title="Users"
      headerContent={
      <PageHeader>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className={getTypographyClass('body')}>Invite User</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilterModal(true)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              <span className={getTypographyClass('body')}>Filter</span>
              {activeFilters > 0 && (
                <Badge variant="default" className="ml-1">
                  {activeFilters}
                </Badge>
              )}
            </Button>
        </div>
      </PageHeader>
      }
    >
      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className={getTypographyClass('header')}>Filter Users</h2>
              <Button
                variant="ghost"
                onClick={() => setShowFilterModal(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Filter Section */}
            <div className="mb-6">
              <h3 className={getTypographyClass('body')}>Filter By</h3>
              <div className="space-y-4 mt-2">
                {/* Role Filter */}
                <div>
                  <label className={getTypographyClass('body')}>Role</label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      variant={filters.role === 'admin' ? 'default' : 'outline'}
                      onClick={() => handleFilterChange('role', filters.role === 'admin' ? undefined : 'admin')}
                      className="flex-1"
                    >
                      <span className={getTypographyClass('body')}>Admin</span>
                    </Button>
                    <Button
                      variant={filters.role === 'rep' ? 'default' : 'outline'}
                      onClick={() => handleFilterChange('role', filters.role === 'rep' ? undefined : 'rep')}
                      className="flex-1"
                    >
                      <span className={getTypographyClass('body')}>Representative</span>
                    </Button>
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className={getTypographyClass('body')}>Status</label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      variant={filters.status === 'active' ? 'default' : 'outline'}
                      onClick={() => handleFilterChange('status', filters.status === 'active' ? undefined : 'active')}
                      className="flex-1"
                    >
                      <span className={getTypographyClass('body')}>Active</span>
                    </Button>
                    <Button
                      variant={filters.status === 'inactive' ? 'default' : 'outline'}
                      onClick={() => handleFilterChange('status', filters.status === 'inactive' ? undefined : 'inactive')}
                      className="flex-1"
                    >
                      <span className={getTypographyClass('body')}>Inactive</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sort Section */}
            <div className="mb-6">
              <h3 className={getTypographyClass('body')}>Sort By</h3>
              <div className="space-y-2 mt-2">
                {(['displayName', 'email', 'role', 'status', 'invitedAt'] as const).map((field) => (
                  <Button
                    key={field}
                    variant={sortField === field ? 'default' : 'outline'}
                    onClick={() => handleSort(field)}
                    className="w-full justify-between"
                  >
                    <span className={getTypographyClass('body')}>
                      {field === 'displayName' ? 'Name' :
                       field === 'invitedAt' ? 'Invited' :
                       field.charAt(0).toUpperCase() + field.slice(1)}
                    </span>
                    <SortIcon field={field} />
                  </Button>
                ))}
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setSortField('displayName');
                  setSortDirection('asc');
                  setFilters({});
                  setActiveFilters(0);
                }}
              >
                <span className={getTypographyClass('body')}>Reset</span>
              </Button>
              <Button
                onClick={() => setShowFilterModal(false)}
              >
                <span className={getTypographyClass('body')}>Apply</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop View - Data Table */}
      <div className="hidden md:block">
        <DataTable>
            <DataTableHeader>
              <tr>
                <DataTableHeaderCell>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('displayName')}
                    className="flex items-center"
                  >
                    <span className={getTypographyClass('body')}>Name</span>
                    <SortIcon field="displayName" />
                  </Button>
                </DataTableHeaderCell>
                <DataTableHeaderCell>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('email')}
                    className="flex items-center"
                  >
                    <span className={getTypographyClass('body')}>Email</span>
                    <SortIcon field="email" />
                  </Button>
                </DataTableHeaderCell>
                <DataTableHeaderCell>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('role')}
                    className="flex items-center"
                  >
                    <span className={getTypographyClass('body')}>Role</span>
                    <SortIcon field="role" />
                  </Button>
                </DataTableHeaderCell>
              <DataTableHeaderCell>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('status')}
                  className="flex items-center"
                >
                  <span className={getTypographyClass('body')}>Status</span>
                  <SortIcon field="status" />
                </Button>
              </DataTableHeaderCell>
                <DataTableHeaderCell>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('invitedAt')}
                    className="flex items-center"
                  >
                    <span className={getTypographyClass('body')}>Invited</span>
                    <SortIcon field="invitedAt" />
                  </Button>
                </DataTableHeaderCell>
                <DataTableHeaderCell className="text-right">
                  <span className={getTypographyClass('body')}>Actions</span>
                </DataTableHeaderCell>
              </tr>
            </DataTableHeader>
            <DataTableBody>
            {filteredAndSortedUsers.map((user) => (
              <DataTableRow key={user.id}>
                  <DataTableCell>
                    <div className="flex flex-col">
                    <span className={getTypographyClass('body')}>
                      {user.displayName}
                    </span>
                    </div>
                  </DataTableCell>
                  <DataTableCell>
                  <span className={getTypographyClass('body')}>{user.email}</span>
                </DataTableCell>
                <DataTableCell>
                  <span className={getTypographyClass('body')}>{user.role}</span>
                </DataTableCell>
                <DataTableCell>
                  <span className={getTypographyClass('body')}>{user.status}</span>
                </DataTableCell>
                <DataTableCell>
                  <span className={getTypographyClass('body')}>
                    {user.invitedAt.toLocaleDateString()}
                  </span>
                </DataTableCell>
                <DataTableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleToggleStatus(user)}
                      className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="sr-only">
                        {user.status === 'active' ? 'Deactivate' : 'Activate'} user
                      </span>
                      {user.status === 'active' ? (
                        <UserMinus className="h-4 w-4" />
                      ) : (
                        <UserPlus className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleToggleRole(user)}
                      className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="sr-only">
                        {user.role === 'admin' ? 'Downgrade' : 'Upgrade'} user role
                      </span>
                      {user.role === 'admin' ? (
                        <ShieldOff className="h-4 w-4" />
                      ) : (
                        <Shield className="h-4 w-4" />
                      )}
                    </Button>
                      <Button 
                        variant="ghost" 
                      onClick={() => handleDelete(user)}
                      className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                      <span className="sr-only">Delete user</span>
                      <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
        </DataTable>
      </div>

      {/* Mobile View - List Report */}
      <div className="md:hidden">
        {filteredAndSortedUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => router.push(`/users/${user.id}`)}
            className="bg-transparent border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="px-4 py-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>
                    {user.displayName}
                  </h3>
                  <p className={getTypographyClass('body')} style={{ margin: 0 }}>
                    {user.email}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{user.role}</span>
                    {user.lastLoginAt && (
                      <>
                        <span>•</span>
                        <span>Last login: {user.lastLoginAt.toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={user.status === 'active' ? 'success' : 'error'}>
                      {user.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(user);
                    }}
                    title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                  >
                    <span className="sr-only">
                      {user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                    </span>
                    {user.status === 'active' ? (
                      <UserMinus className="h-4 w-4" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleRole(user);
                    }}
                    title={user.role === 'admin' ? 'Downgrade to Representative' : 'Upgrade to Admin'}
                  >
                    <span className="sr-only">
                      {user.role === 'admin' ? 'Downgrade to Representative' : 'Upgrade to Admin'}
                    </span>
                    {user.role === 'admin' ? (
                      <ShieldOff className="h-4 w-4" />
                    ) : (
                      <Shield className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(user);
                    }}
                    title="Delete User"
                  >
                    <span className="sr-only">Delete user</span>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <InviteUserModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSuccess={handleInviteSuccess}
      />
    </PageLayout>
  );
} 