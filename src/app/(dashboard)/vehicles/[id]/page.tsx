'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Archive, Trash2, ArrowLeft, Check, X, Settings2, Plus, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useVehicleDetails } from '@/hooks/useVehicleDetails';
import { useVehicleOperations } from '@/hooks/useVehicleOperations';
import { useAuth } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';
import { useCustomers } from '@/hooks/useCustomers';
import { useCustomerOperations } from '@/hooks/useCustomerOperations';
import { AddCustomerModal } from '@/components/customers/AddCustomerModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { VehicleStatus } from '@/types/vehicle';
import { DataTable, DataTableHeader, DataTableBody, DataTableRow, DataTableCell, DataTableHeaderCell } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import Head from 'next/head';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doc, updateDoc, serverTimestamp, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Checkbox } from "@/components/ui/Checkbox";
import { Textarea } from "@/components/ui/Textarea";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { MaintenanceRecord, StatusChangeRecord } from "@/types/vehicle";
import { PageLayout } from '@/components/layout/PageLayout';
import { getTypographyClass } from '@/lib/typography';
import { formatTimestamp } from '@/lib/utils';

export default function VehicleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { users } = useUsers();
  const { customers } = useCustomers();
  const { addCustomer, assignVehicle } = useCustomerOperations();
  const { deleteVehicle } = useVehicleOperations();
  const isAdmin = user?.role === 'admin';
  const { vehicle, loading, error, isSaving, updateField, updateStatus, setVehicle } = useVehicleDetails(params.id as string);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<VehicleStatus | null>(null);
  const [newMileage, setNewMileage] = useState<number | null>(null);
  const [isOilChange, setIsOilChange] = useState(false);
  const [maintenanceNote, setMaintenanceNote] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [showMileageWarning, setShowMileageWarning] = useState(false);
  const [isReviewStep, setIsReviewStep] = useState(false);
  const [showAllMaintenance, setShowAllMaintenance] = useState(false);
  const [showAllStatus, setShowAllStatus] = useState(false);

  // Default 'Assigned To' to self when status is set to Prospecting and modal opens
  useEffect(() => {
    if (showStatusModal && newStatus === VehicleStatus.Prospecting && !selectedUserId && user) {
      setSelectedUserId(user.uid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showStatusModal, newStatus, user]);

  const handleBack = () => {
    router.back();
  };

  const getStatusVariant = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.Available:
        return 'success';
      case VehicleStatus.Maintenance:
      case VehicleStatus.Prospecting:
        return 'warning';
      case VehicleStatus.WithCustomer:
      case VehicleStatus.Unavailable:
      case VehicleStatus.Archived:
        return 'error';
      default:
        return 'default';
    }
  };

  const getOilChangeStatus = (currentMileage: number | null, milesUntilOilChange: number | null) => {
    if (!currentMileage || !milesUntilOilChange) return null;
    
    // Show status if due soon (within 500 miles) or due/overdue
    if (milesUntilOilChange <= 500) {
      if (milesUntilOilChange <= 0) {
        return {
          variant: 'error' as const,
          message: `Oil change overdue by ${Math.abs(milesUntilOilChange).toLocaleString()} miles`
        };
      }
      return {
        variant: 'warning' as const,
        message: `Oil change due in ${milesUntilOilChange.toLocaleString()} miles`
      };
    }
    return null;
  };

  const handleEdit = (field: string, value: string | number | null) => {
    setEditingField(field);
    setEditValue(value?.toString() || '');
  };

  const handleSave = async () => {
    if (!editingField) return;
    
    try {
      const success = await updateField(editingField, editValue);
      if (success) {
        toast.success('Vehicle updated successfully');
        setEditingField(null);
      } else {
        toast.error('Failed to update vehicle');
      }
    } catch (error) {
      toast.error('An error occurred while updating the vehicle');
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

  const renderEditableCell = (field: string, value: string | number | null) => {
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

  const handleStatusChange = async () => {
    if (!newStatus || newMileage === null) return;
    if (!user) {
      toast.error('You must be logged in to change vehicle status');
      return;
    }
    if (!user.displayName) {
      toast.error('User profile is incomplete. Please update your profile.');
      return;
    }
    
    const success = await updateStatus(newStatus, newMileage);
    
    if (success) {
      // Record the status change
      const statusChangeRecord: StatusChangeRecord = {
        previousStatus: vehicle.status,
        newStatus,
        date: Timestamp.now(),
        mileage: newMileage,
        userId: user.uid,
        userName: user.displayName,
        ...(maintenanceNote ? { note: maintenanceNote } : {})
      };

      // Handle oil change if applicable
      if (isOilChange) {
        const maintenanceRecord: MaintenanceRecord = {
          type: 'oil_change',
          date: Timestamp.now(),
          mileage: newMileage,
          userId: user.uid,
          userName: user.displayName,
          ...(maintenanceNote ? { note: maintenanceNote } : {})
        };
        
        await updateDoc(doc(db, 'vehicles', vehicle.id), {
          maintenanceHistory: arrayUnion(maintenanceRecord),
          statusHistory: arrayUnion(statusChangeRecord),
          milesUntilOilChange: 5000,
          updatedAt: serverTimestamp()
        });
      } else {
        // Just update the status history
        await updateDoc(doc(db, 'vehicles', vehicle.id), {
          statusHistory: arrayUnion(statusChangeRecord),
          updatedAt: serverTimestamp()
        });
      }
      
      toast.success('Status updated successfully');
      setShowStatusModal(false);
      setNewStatus(null);
      setNewMileage(null);
      setIsOilChange(false);
      setMaintenanceNote('');
    } else {
      toast.error('Failed to update status');
    }
  };

  const handleCloseModal = () => {
    setShowStatusModal(false);
    setNewStatus(null);
    setNewMileage(null);
    setIsOilChange(false);
    setMaintenanceNote('');
    setSelectedUserId('');
    setSelectedCustomerId('');
    setCustomerSearchQuery('');
  };

  const handleCustomerCreated = (customer: { id: string; name: string }) => {
    setSelectedCustomerId(customer.id);
    setShowAddCustomerModal(false);
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    customer.phone.toLowerCase().includes(customerSearchQuery.toLowerCase())
  );

  const renderMaintenanceHistory = () => {
    if (!vehicle.maintenanceHistory || vehicle.maintenanceHistory.length === 0) {
      return <p className="text-gray-500 dark:text-gray-400">No maintenance records found.</p>;
    }

    const recordsToShow = showAllMaintenance ? vehicle.maintenanceHistory : vehicle.maintenanceHistory.slice(0, 3);
    const remainingCount = vehicle.maintenanceHistory.length - 3;

    return (
      <>
        <div className="space-y-6">
          {recordsToShow.map((record, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={record.type === 'oil_change' ? 'default' : 'warning'} className="px-0">
                    {record.type === 'oil_change' ? 'Oil Change' : 'Maintenance'}
                  </Badge>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {record.mileage.toLocaleString()} miles
                  </span>
                </div>
                <div className="space-y-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {format(record.date.toDate(), 'MMM d, yyyy h:mm a')}
                </span>
                {record.note && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {record.note}
                  </p>
                )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    By {record.userName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!showAllMaintenance && remainingCount > 0 && (
          <button
            onClick={() => setShowAllMaintenance(true)}
            className="mt-6 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            See {remainingCount} more record{remainingCount !== 1 ? 's' : ''}
          </button>
        )}
      </>
    );
  };

  const renderStatusHistory = () => {
    if (!vehicle.statusHistory || vehicle.statusHistory.length === 0) {
      return <p className="text-gray-500 dark:text-gray-400">No status changes recorded.</p>;
    }

    const recordsToShow = showAllStatus ? vehicle.statusHistory : vehicle.statusHistory.slice(0, 3);
    const remainingCount = vehicle.statusHistory.length - 3;

    return (
      <>
        <div className="space-y-4">
          {recordsToShow.map((record, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={getStatusVariant(record.newStatus)}>
                    {record.newStatus}
                  </Badge>
                  <span className="text-sm font-medium">
                    {record.mileage.toLocaleString()} miles
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {format(record.date.toDate(), 'MMM d, yyyy h:mm a')}
                </span>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Changed from <span className="font-medium">{record.previousStatus}</span> to <span className="font-medium">{record.newStatus}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    By {record.userName}
                  </p>
                  {record.note && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Note: {record.note}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {!showAllStatus && remainingCount > 0 && (
          <button
            onClick={() => setShowAllStatus(true)}
            className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            See {remainingCount} more record{remainingCount !== 1 ? 's' : ''}
          </button>
        )}
      </>
    );
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const renderStatusCell = () => {
    return (
      <div className="flex items-center gap-2">
        <Badge variant={getStatusVariant(vehicle.status)}>
          {vehicle.status === VehicleStatus.Prospecting && vehicle.statusHistory && vehicle.statusHistory.length > 0 ? (
            <div className="flex items-center gap-1">
              <span>Prospecting</span>
              <span className="text-xs opacity-75">by {vehicle.statusHistory[vehicle.statusHistory.length - 1].userName}</span>
            </div>
          ) : (
            vehicle.status
          )}
        </Badge>
        {vehicle.currentMileage && vehicle.milesUntilOilChange && (
          getOilChangeStatus(vehicle.currentMileage, vehicle.milesUntilOilChange) && (
            <Badge variant={getOilChangeStatus(vehicle.currentMileage, vehicle.milesUntilOilChange)?.variant}>
              {getOilChangeStatus(vehicle.currentMileage, vehicle.milesUntilOilChange)?.message}
            </Badge>
          )
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <PageLayout title="Vehicle Details">
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
      </PageLayout>
    );
  }

  if (error || !vehicle) {
    return (
      <PageLayout title="Vehicle Details">
      <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
          <p className={getTypographyClass('body')}>
            {error instanceof Error ? error.message : 'Failed to load vehicle details'}
          </p>
      </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`${vehicle.vehicleDescriptor} - Vehicle Details`}>
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
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                onClick={() => setShowStatusModal(true)}
              >
                Change Status
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
          </div>

          {/* Vehicle Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className={getTypographyClass('header')}>Information</h2>
            </div>
            <DataTable>
              <DataTableBody>
                <DataTableRow>
                  <DataTableCell className="font-medium w-1/3">Vehicle Descriptor</DataTableCell>
                  <DataTableCell>
                    {renderEditableCell('vehicleDescriptor', vehicle.vehicleDescriptor)}
                  </DataTableCell>
                </DataTableRow>
                <DataTableRow>
                  <DataTableCell className="font-medium w-1/3">License Plate</DataTableCell>
                  <DataTableCell>
                    {renderEditableCell('licensePlate', vehicle.licensePlate)}
                  </DataTableCell>
                </DataTableRow>
                <DataTableRow>
                  <DataTableCell className="font-medium w-1/3">Color</DataTableCell>
                  <DataTableCell>
                    {renderEditableCell('color', vehicle.color)}
                  </DataTableCell>
                </DataTableRow>
                <DataTableRow>
                  <DataTableCell className="font-medium w-1/3">Status</DataTableCell>
                  <DataTableCell>
                    {renderStatusCell()}
                  </DataTableCell>
                </DataTableRow>
              </DataTableBody>
            </DataTable>
            </div>

            {/* Current Assignment Section */}
            {vehicle.currentAssignment && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className={getTypographyClass('header')}>Current Assignment</h2>
            </div>
            <DataTable>
              <DataTableBody>
                <DataTableRow>
                      <DataTableCell className="font-medium w-1/3">Customer</DataTableCell>
                  <DataTableCell>
                        <div className="flex items-center gap-2">
                          <span className={getTypographyClass('body')}>
                            {vehicle.currentAssignment.customer.name}
                          </span>
                          <Button
                            variant="ghost"
                            onClick={() => router.push(`/customers/${vehicle.currentAssignment.customer.id}`)}
                            className="flex items-center gap-2 h-8 px-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className={getTypographyClass('body')}>View</span>
                          </Button>
                        </div>
                  </DataTableCell>
                </DataTableRow>
                <DataTableRow>
                      <DataTableCell className="font-medium w-1/3">Assigned On</DataTableCell>
                  <DataTableCell>
                        <span className={getTypographyClass('body')}>
                          {formatTimestamp(vehicle.currentAssignment.assignedAt)}
                        </span>
                  </DataTableCell>
                </DataTableRow>
                <DataTableRow>
                      <DataTableCell className="font-medium w-1/3">Assigned By</DataTableCell>
                  <DataTableCell>
                        <span className={getTypographyClass('body')}>
                          {vehicle.currentAssignment.assignedBy.name}
                        </span>
                  </DataTableCell>
                </DataTableRow>
              </DataTableBody>
            </DataTable>
        </div>
            )}

            {/* History Section */}
            {vehicle.history && vehicle.history.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className={getTypographyClass('header')}>History</h2>
            </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {vehicle.history.map((entry) => (
                    <div 
                      key={entry.id} 
                      className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      onClick={() => entry.metadata?.customerId && router.push(`/customers/${entry.metadata.customerId}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className={getTypographyClass('body')}>
                            {entry.description.replace('Vehicle ', '').replace(' assigned to customer', '')}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {formatTimestamp(entry.timestamp)} • {entry.user.name}
                          </p>
              </div>
            </div>
            </div>
                  ))}
                  </div>
                </div>
              )}

            {/* Maintenance History Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className={getTypographyClass('header')}>Maintenance History</h2>
              </div>
              <div className="p-6">
                {renderMaintenanceHistory()}
              </div>
            </div>

            {/* Status History Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className={getTypographyClass('header')}>Status History</h2>
              </div>
              <div className="p-6">
                {renderStatusHistory()}
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className={getTypographyClass('header')}>Additional Information</h2>
              </div>
                    <div className="relative">
              <div className="relative overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                <table className="min-w-full">
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 bg-transparent font-medium w-1/3">Created</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 bg-transparent">
                        {vehicle.createdAt 
                          ? (vehicle.createdAt as any).toDate 
                            ? (vehicle.createdAt as any).toDate().toLocaleString() 
                            : new Date(vehicle.createdAt).toLocaleString() 
                          : 'N/A'}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 bg-transparent font-medium w-1/3">Last Updated</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 bg-transparent">
                        {vehicle.updatedAt 
                          ? (vehicle.updatedAt as any).toDate 
                            ? (vehicle.updatedAt as any).toDate().toLocaleString() 
                            : new Date(vehicle.updatedAt).toLocaleString() 
                          : 'N/A'}
                      </td>
                    </tr>
                  </tbody>
                </table>
                    </div>
                                </div>
                                </div>
                              </div>
                          </div>

      {/* Status Modal */}
      <Dialog open={showStatusModal} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Vehicle Status</DialogTitle>
          </DialogHeader>
          
          <form className="p-3 space-y-6">
            <div className="space-y-4">
              <div>
                <Label>New Status</Label>
                <Select 
                  value={newStatus || ''} 
                  onValueChange={(value) => setNewStatus(value as VehicleStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(VehicleStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Current Mileage: {vehicle.currentMileage?.toLocaleString() || 'Not set'}
                </div>
                <Input
                  type="number"
                  value={newMileage || ''}
                  onChange={(e) => setNewMileage(Number(e.target.value))}
                  placeholder="Enter new mileage"
                  min={0}
                />
              </div>

              {newStatus === VehicleStatus.Maintenance && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="oilChange"
                      checked={isOilChange}
                      onCheckedChange={(checked) => setIsOilChange(checked as boolean)}
                    />
                    <Label htmlFor="oilChange">Oil Change</Label>
                  </div>
                  <Textarea
                    value={maintenanceNote}
                    onChange={(e) => setMaintenanceNote(e.target.value)}
                    placeholder="Maintenance notes (optional)"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button 
                variant="primary"
                onClick={handleStatusChange}
                disabled={!newStatus || newMileage === null}
              >
                Update Status
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Vehicle</DialogTitle>
          </DialogHeader>
          <div className="p-3">
            <p className={getTypographyClass('body')}>
              Are you sure you want to delete {vehicle.vehicleDescriptor}? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                setIsDeleting(true);
                try {
                  await deleteVehicle(vehicle.id);
                  toast.success('Vehicle deleted successfully');
                  router.push('/vehicles');
                } catch (error) {
                  console.error('Error deleting vehicle:', error);
                  toast.error('Failed to delete vehicle');
                } finally {
                  setIsDeleting(false);
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddCustomerModal
        isOpen={showAddCustomerModal}
        onClose={() => setShowAddCustomerModal(false)}
        onSuccess={handleCustomerCreated}
      />
      
      {/* Mobile View */}
      <div className="md:hidden space-y-6 pb-20">
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
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              onClick={() => setShowStatusModal(true)}
            >
              Change Status
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
                  </div>

        {/* Vehicle Information */}
        <div className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className={getTypographyClass('header')} style={{ margin: 0 }}>Information</h2>
                  </div>
          <div className="p-4 space-y-4">
            <div className="space-y-1">
              <label className={getTypographyClass('body')}>Vehicle Descriptor</label>
              {renderEditableCell('vehicleDescriptor', vehicle.vehicleDescriptor)}
                </div>
            <div className="space-y-1">
              <label className={getTypographyClass('body')}>License Plate</label>
              {renderEditableCell('licensePlate', vehicle.licensePlate)}
                    </div>
            <div className="space-y-1">
              <label className={getTypographyClass('body')}>Color</label>
              {renderEditableCell('color', vehicle.color)}
                    </div>
            <div className="space-y-1">
              <label className={getTypographyClass('body')}>Status</label>
              {renderStatusCell()}
                  </div>
          </div>
              </div>

        {/* Current Assignment Section */}
        {vehicle.currentAssignment && (
          <div className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className={getTypographyClass('header')} style={{ margin: 0 }}>Current Assignment</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <label className={getTypographyClass('body')}>Customer</label>
                <div className="flex items-center gap-2">
                  <span className={getTypographyClass('body')}>
                    {vehicle.currentAssignment.customer.name}
                  </span>
                <Button
                    variant="ghost"
                    onClick={() => router.push(`/customers/${vehicle.currentAssignment.customer.id}`)}
                    className="flex items-center gap-2 h-8 px-2"
                >
                    <ExternalLink className="h-4 w-4" />
                    <span className={getTypographyClass('body')}>View</span>
                </Button>
                </div>
                  </div>
              <div className="space-y-1">
                <label className={getTypographyClass('body')}>Assigned On</label>
                <span className={getTypographyClass('body')}>
                  {formatTimestamp(vehicle.currentAssignment.assignedAt)}
                </span>
                      </div>
              <div className="space-y-1">
                <label className={getTypographyClass('body')}>Assigned By</label>
                <span className={getTypographyClass('body')}>
                  {vehicle.currentAssignment.assignedBy.name}
                </span>
                                  </div>
                                  </div>
                            </div>
                          )}

        {/* History Section */}
        {vehicle.history && vehicle.history.length > 0 && (
          <div className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className={getTypographyClass('header')} style={{ margin: 0 }}>History</h2>
                        </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {vehicle.history.map((entry) => (
                <div 
                  key={entry.id} 
                  className="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  onClick={() => entry.metadata?.customerId && router.push(`/customers/${entry.metadata.customerId}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className={getTypographyClass('body')}>
                        {entry.description.replace('Vehicle ', '').replace(' assigned to customer', '')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatTimestamp(entry.timestamp)} • {entry.user.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
                    </div>
                  </div>
                )}

        {/* Maintenance History Section */}
        <div className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className={getTypographyClass('header')} style={{ margin: 0 }}>Maintenance History</h2>
          </div>
          <div className="p-4">
            {renderMaintenanceHistory()}
          </div>
        </div>

        {/* Status History Section */}
        <div className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className={getTypographyClass('header')} style={{ margin: 0 }}>Status History</h2>
          </div>
          <div className="p-4">
            {renderStatusHistory()}
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className={getTypographyClass('header')} style={{ margin: 0 }}>Additional Information</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-1">
              <label className={`${getTypographyClass('body')} text-gray-600 dark:text-gray-400 text-sm`}>Created</label>
              <span className={`${getTypographyClass('body')} block mt-1 text-gray-900 dark:text-gray-100`}>
                {vehicle.createdAt 
                  ? (vehicle.createdAt as any).toDate 
                    ? (vehicle.createdAt as any).toDate().toLocaleString() 
                    : new Date(vehicle.createdAt).toLocaleString() 
                  : 'N/A'}
              </span>
            </div>
            <div className="space-y-1">
              <label className={`${getTypographyClass('body')} text-gray-600 dark:text-gray-400 text-sm`}>Last Updated</label>
              <span className={`${getTypographyClass('body')} block mt-1 text-gray-900 dark:text-gray-100`}>
                {vehicle.updatedAt 
                  ? (vehicle.updatedAt as any).toDate 
                    ? (vehicle.updatedAt as any).toDate().toLocaleString() 
                    : new Date(vehicle.updatedAt).toLocaleString() 
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 