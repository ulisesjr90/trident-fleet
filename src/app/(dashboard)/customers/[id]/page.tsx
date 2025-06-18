'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Trash2, ArrowLeft, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCustomerDetails } from '@/hooks/useCustomerDetails';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getTypographyClass } from '@/lib/typography';
import { useAuth } from '@/hooks/useAuth';
import { doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { DataTable, DataTableHeader, DataTableBody, DataTableRow, DataTableCell, DataTableHeaderCell } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import Head from 'next/head';
import { Badge } from '@/components/ui/Badge';
import { PageLayout } from '@/components/layout/PageLayout';
import { useCustomerHistory } from '@/hooks/useCustomerHistory';
import { VehicleStatus } from '@/types/vehicle';

const getDateString = (date: any) => {
  if (!date) return 'N/A';
  if (typeof date.toDate === 'function') return date.toDate().toLocaleString();
  const d = new Date(date);
  return isNaN(d.getTime()) ? 'N/A' : d.toLocaleString();
};

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { customer, loading, error, updateField, deleteCustomer: deleteCustomerFromHook } = useCustomerDetails(params.id as string);
  const { history: customerHistory, loading: historyLoading } = useCustomerHistory(params.id as string);
  const { isAdmin } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleDelete = async () => {
    if (!customer) return;
    
    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      setIsDeleting(true);
      try {
        const success = await deleteCustomerFromHook();
        if (success) {
          toast.success('Customer deleted successfully');
          router.push('/customers');
        } else {
          toast.error('Failed to delete customer');
        }
      } catch (error) {
        toast.error('An error occurred while deleting the customer');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value || '');
  };

  const handleSave = async () => {
    if (!editingField) return;
    
    setIsSaving(true);
    try {
      const success = await updateField(editingField, editValue);
    if (success) {
        toast.success('Customer updated successfully');
        setEditingField(null);
      } else {
        toast.error('Failed to update customer');
      }
    } catch (error) {
      toast.error('An error occurred while updating the customer');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const renderEditableCell = (field: string, value: string) => {
    if (editingField === field) {
      return (
        <div className="flex items-center gap-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1"
          />
          <Button
            variant="ghost"
            onClick={handleSave}
            disabled={isSaving}
            className="h-8 w-8 p-0 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }
    return (
      <div 
        onClick={() => handleEdit(field, value)}
        className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
      >
        {value || '-'}
      </div>
    );
  };

  const formatTimestamp = (date: Date | Timestamp) => {
    const dateObj = date instanceof Timestamp ? date.toDate() : new Date(date);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(dateObj);
  };

  if (loading) {
    return (
      <PageLayout title="Customer Details">
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
      </PageLayout>
    );
  }

  if (error || !customer) {
    return (
      <PageLayout title="Customer Details">
      <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
        <p className={getTypographyClass('body')}>
          {error instanceof Error ? error.message : 'Failed to load customer details'}
        </p>
      </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`${customer.name} - Customer Details`}>
      {/* Desktop View */}
      <div className="hidden md:block">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
                  <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
                  >
            <ArrowLeft className="h-4 w-4" />
            <span className={getTypographyClass('body')}>Back</span>
                  </Button>
          {isAdmin && (
                  <Button
                    variant="danger"
                    onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2"
                  >
              <Trash2 className="h-4 w-4" />
              <span className={getTypographyClass('body')}>Delete</span>
                  </Button>
          )}
                  </div>

        {/* Combined Information Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className={getTypographyClass('header')}>Information</h2>
                </div>
          <DataTable>
            <DataTableBody>
              <DataTableRow>
                <DataTableCell className="font-medium w-1/3">Name</DataTableCell>
                <DataTableCell>
                  {renderEditableCell('name', customer.name)}
                </DataTableCell>
              </DataTableRow>
              <DataTableRow>
                <DataTableCell className="font-medium w-1/3">Email</DataTableCell>
                <DataTableCell>
                  {renderEditableCell('email', customer.email)}
                </DataTableCell>
              </DataTableRow>
              <DataTableRow>
                <DataTableCell className="font-medium w-1/3">Phone</DataTableCell>
                <DataTableCell>
                  {renderEditableCell('phone', customer.phone || '')}
                </DataTableCell>
              </DataTableRow>
              <DataTableRow>
                <DataTableCell className="font-medium w-1/3">Created</DataTableCell>
                <DataTableCell>
                  {getDateString(customer.createdAt)}
                </DataTableCell>
              </DataTableRow>
              <DataTableRow>
                <DataTableCell className="font-medium w-1/3">Last Updated</DataTableCell>
                <DataTableCell>
                  {getDateString(customer.updatedAt)}
                </DataTableCell>
              </DataTableRow>
            </DataTableBody>
          </DataTable>
              </div>

        {/* Vehicles Section */}
        {customer.vehicles && customer.vehicles.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className={getTypographyClass('header')}>Currently Assigned Vehicles</h2>
            </div>
            <DataTable>
              <DataTableHeader>
                <tr>
                  <DataTableHeaderCell>Vehicle</DataTableHeaderCell>
                  <DataTableHeaderCell>Assigned On</DataTableHeaderCell>
                </tr>
              </DataTableHeader>
              <DataTableBody>
                {customer.vehicles.map((vehicle) => (
                  <DataTableRow 
                    key={vehicle.id}
                    onClick={() => router.push(`/vehicles/${vehicle.id}`)}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <DataTableCell>
                      <div className="flex items-center gap-2">
                        <span className={getTypographyClass('body')}>{vehicle.vehicleDescriptor}</span>
                      </div>
                    </DataTableCell>
                    <DataTableCell>
                      <span className={getTypographyClass('body')}>
                        {vehicle.assignedBy.name} on {formatTimestamp(vehicle.assignedAt)}
                      </span>
                    </DataTableCell>
                  </DataTableRow>
                ))}
              </DataTableBody>
            </DataTable>
        </div>
        )}

        {/* History Section */}
        {customerHistory && customerHistory.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className={getTypographyClass('header')}>Customer History</h2>
            </div>
            <DataTable>
              <DataTableHeader>
                <tr>
                  <DataTableHeaderCell>Type</DataTableHeaderCell>
                  <DataTableHeaderCell>Description</DataTableHeaderCell>
                  <DataTableHeaderCell>User</DataTableHeaderCell>
                  <DataTableHeaderCell>Timestamp</DataTableHeaderCell>
                </tr>
              </DataTableHeader>
              <DataTableBody>
                {customerHistory.map((historyItem) => (
                  <DataTableRow key={historyItem.id}>
                    <DataTableCell>
                      <Badge 
                        variant={
                          historyItem.type === 'vehicle' ? 'warning' :
                          historyItem.type === 'update' ? 'default' :
                          historyItem.type === 'share' ? 'success' :
                          'default'
                        }
                      >
                        {historyItem.type}
                      </Badge>
                    </DataTableCell>
                    <DataTableCell>
                      {historyItem.description}
                      {historyItem.metadata?.vehicleDescriptor && (
                        <span className="block text-sm text-gray-500 dark:text-gray-400">
                          {historyItem.metadata.vehicleDescriptor}
                        </span>
                      )}
                    </DataTableCell>
                    <DataTableCell>{historyItem.user.name}</DataTableCell>
                    <DataTableCell>
                      {formatTimestamp(historyItem.timestamp)}
                    </DataTableCell>
                  </DataTableRow>
                ))}
              </DataTableBody>
            </DataTable>
          </div>
        )}
      </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className={getTypographyClass('body')}>Back</span>
          </Button>
          {isAdmin && (
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              <span className={getTypographyClass('body')}>Delete</span>
            </Button>
          )}
        </div>

        {/* Information Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className={getTypographyClass('header')}>Information</h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Name</p>
              {renderEditableCell('name', customer.name)}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
              {renderEditableCell('email', customer.email)}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
              {renderEditableCell('phone', customer.phone || '')}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Created</p>
              <p className={getTypographyClass('body')}>{getDateString(customer.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Last Updated</p>
              <p className={getTypographyClass('body')}>{getDateString(customer.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Vehicles Section */}
        {customer.vehicles && customer.vehicles.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className={getTypographyClass('header')}>Currently Assigned Vehicles</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {customer.vehicles.map((vehicle) => (
                <div 
                  key={vehicle.id} 
                  className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  onClick={() => router.push(`/vehicles/${vehicle.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className={getTypographyClass('body')}>
                        {vehicle.vehicleDescriptor}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={
                            vehicle.status === VehicleStatus.Available ? 'success' :
                            vehicle.status === VehicleStatus.Maintenance ? 'warning' :
                            vehicle.status === VehicleStatus.WithCustomer ? 'default' :
                            'error'
                          }
                        >
                          {vehicle.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Assigned by {vehicle.assignedBy.name} on {vehicle.assignedAt.toDate().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Section */}
        {customerHistory && customerHistory.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className={getTypographyClass('header')}>Customer History</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {customerHistory.map((historyItem) => (
                <div 
                  key={historyItem.id} 
                  className="px-6 py-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant={
                            historyItem.type === 'vehicle' ? 'warning' :
                            historyItem.type === 'update' ? 'default' :
                            historyItem.type === 'share' ? 'success' :
                            'default'
                          }
                        >
                          {historyItem.type}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTimestamp(historyItem.timestamp)}
                        </span>
                      </div>
                      <p className={getTypographyClass('body')}>
                        {historyItem.description}
                      </p>
                      {historyItem.metadata?.vehicleDescriptor && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {historyItem.metadata.vehicleDescriptor}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        By {historyItem.user.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
} 