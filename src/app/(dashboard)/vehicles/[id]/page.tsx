'use client';

import { useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { CollapsibleSection } from '@/components/ui/CollapsibleSection';
import { useVehicleDetails } from '@/hooks/useVehicleDetails';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { EditableField } from '@/components/customers/EditableField';
import { Trash2, Archive } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { PageContainer } from '@/components/layout/PageContainer';

export default function VehicleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const vehicleId = params.id as string;
  const isAdmin = session?.user?.role === 'admin';
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [editableFields, setEditableFields] = useState([
    { name: 'vehicleDescriptor', value: '', isEditing: false, type: 'text' },
    { name: 'color', value: '', isEditing: false, type: 'text' },
    { name: 'source', value: '', isEditing: false, type: 'text' },
    { name: 'vin', value: '', isEditing: false, type: 'text' },
    { name: 'licensePlate', value: '', isEditing: false, type: 'text' },
    { name: 'state', value: '', isEditing: false, type: 'text' },
    { name: 'registrationExpiration', value: '', isEditing: false, type: 'date' },
    { name: 'currentMileage', value: '', isEditing: false, type: 'number' },
    { name: 'nextOilChangeDueMileage', value: '', isEditing: false, type: 'number' },
    { name: 'mvaNumber', value: '', isEditing: false, type: 'text' },
    { name: 'returnDate', value: '', isEditing: false, type: 'date' }
  ]);
  
  const { vehicle, loading } = useVehicleDetails(vehicleId);

  const handleBack = () => {
    router.push('/vehicles');
  };

  const handleDelete = async () => {
    if (!vehicle || !isAdmin) return;
    
    try {
      setIsDeleting(true);
      const vehicleRef = doc(db, 'vehicles', vehicleId);
      await deleteDoc(vehicleRef);
      router.push('/vehicles');
    } catch (err) {
      console.error('Failed to delete vehicle:', err);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleArchive = async () => {
    if (!vehicle || !isAdmin) return;
    
    try {
      setIsArchiving(true);
      const vehicleRef = doc(db, 'vehicles', vehicleId);
      await updateDoc(vehicleRef, {
        status: 'Archived',
        archivedAt: new Date(),
        updatedAt: new Date()
      });
      router.push('/vehicles');
    } catch (err) {
      console.error('Failed to archive vehicle:', err);
    } finally {
      setIsArchiving(false);
      setShowArchiveConfirm(false);
    }
  };

  const handleFieldClick = (fieldName: string) => {
    if (!isAdmin) return;
    setEditableFields(fields =>
      fields.map(field =>
        field.name === fieldName
          ? { ...field, isEditing: true }
          : field
      )
    );
  };

  const handleFieldSave = async (fieldName: string, value: string) => {
    if (!vehicle || !isAdmin) return;
    
    try {
      const field = editableFields.find(f => f.name === fieldName);
      let processedValue = value;
      
      // Handle date fields
      if (field?.type === 'date' && value) {
        processedValue = new Date(value).toISOString();
      }
      
      const vehicleRef = doc(db, 'vehicles', vehicleId);
      await updateDoc(vehicleRef, {
        [fieldName]: processedValue,
        updatedAt: new Date()
      });
      setEditableFields(fields =>
        fields.map(field =>
          field.name === fieldName
            ? { ...field, isEditing: false }
            : field
        )
      );
    } catch (err) {
      console.error('Failed to update field:', err);
    }
  };

  const handleFieldCancel = (fieldName: string) => {
    setEditableFields(fields =>
      fields.map(field =>
        field.name === fieldName
          ? { ...field, isEditing: false, value: vehicle?.[fieldName as keyof typeof vehicle] as string || '' }
          : field
      )
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent, fieldName: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const field = editableFields.find(f => f.name === fieldName);
      if (field) {
        handleFieldSave(fieldName, field.value);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleFieldCancel(fieldName);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Vehicle not found</h2>
        </div>
      </div>
    );
  }

  // Update editable fields with vehicle data
  if (vehicle && editableFields[0].value === '') {
    setEditableFields(fields =>
      fields.map(field => {
        let value = vehicle[field.name as keyof typeof vehicle] as string || '';
        // Format date fields for display
        if (field.type === 'date' && value) {
          value = new Date(value).toISOString().split('T')[0];
        }
        return { ...field, value };
      })
    );
  }

  return (
    <MobileLayout
      header={{
        title: 'Vehicle Details',
        showBackButton: true,
        onBackClick: handleBack
      }}
      userRole={session?.user?.role as "admin" | "rep"}
      currentPath={pathname}
    >
      <PageContainer>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <div className="flex flex-wrap items-center justify-end gap-2 w-full">
            <Badge variant="default">{vehicle.status}</Badge>
            {isAdmin && vehicle.status !== 'Archived' && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowArchiveConfirm(true)}
                  disabled={isArchiving}
                  className="flex items-center"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  className="flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Delete Vehicle</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this vehicle? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full sm:w-auto"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Archive Confirmation Modal */}
        {showArchiveConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Archive Vehicle</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to archive this vehicle? You can restore it later if needed.
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowArchiveConfirm(false)}
                  disabled={isArchiving}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={handleArchive}
                  disabled={isArchiving}
                  className="w-full sm:w-auto"
                >
                  {isArchiving ? 'Archiving...' : 'Archive'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Basic Information */}
        <CollapsibleSection title="Basic Information">
          <div className="space-y-2 sm:space-y-3">
            {editableFields
              .filter(field => ['vehicleDescriptor', 'color', 'source', 'vin', 'licensePlate', 'state', 'registrationExpiration', 'currentMileage', 'nextOilChangeDueMileage'].includes(field.name))
              .map(field => (
                <EditableField
                  key={field.name}
                  name={field.name}
                  value={field.value}
                  isEditing={field.isEditing}
                  isOwner={isAdmin}
                  onEdit={() => handleFieldClick(field.name)}
                  onSave={(value) => handleFieldSave(field.name, value)}
                  onCancel={() => handleFieldCancel(field.name)}
                  onKeyDown={(e) => handleKeyDown(e, field.name)}
                  placeholder={field.name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  setEditableFields={setEditableFields}
                  type={field.type as 'text' | 'date' | 'number'}
                />
              ))}
          </div>
        </CollapsibleSection>

        {/* Avis-specific fields */}
        {vehicle.source === 'Avis' && (
          <CollapsibleSection title="Avis Information">
            <div className="space-y-2 sm:space-y-3">
              {editableFields
                .filter(field => ['mvaNumber', 'returnDate'].includes(field.name))
                .map(field => (
                  <EditableField
                    key={field.name}
                    name={field.name}
                    value={field.value}
                    isEditing={field.isEditing}
                    isOwner={isAdmin}
                    onEdit={() => handleFieldClick(field.name)}
                    onSave={(value) => handleFieldSave(field.name, value)}
                    onCancel={() => handleFieldCancel(field.name)}
                    onKeyDown={(e) => handleKeyDown(e, field.name)}
                    placeholder={field.name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    setEditableFields={setEditableFields}
                    type={field.type as 'text' | 'date' | 'number'}
                  />
                ))}
            </div>
          </CollapsibleSection>
        )}

        {/* History Sections */}
        <CollapsibleSection title="Status History">
          <p className="text-gray-500 dark:text-gray-400">Status history coming soon...</p>
        </CollapsibleSection>

        <CollapsibleSection title="Service History">
          <p className="text-gray-500 dark:text-gray-400">Service history coming soon...</p>
        </CollapsibleSection>

        {vehicle.customerId && (
          <CollapsibleSection title="Customer History">
            <p className="text-gray-500 dark:text-gray-400">Customer history coming soon...</p>
          </CollapsibleSection>
        )}

        {/* Creation date */}
        <div className="text-sm text-gray-500 dark:text-gray-400 text-right mt-4 sm:mt-6">
          Created on {formatDate(vehicle.createdAt)}
        </div>
      </PageContainer>
    </MobileLayout>
  );
} 