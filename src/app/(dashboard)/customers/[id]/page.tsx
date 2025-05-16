'use client';

import { useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Share2, ArrowLeft, Trash2 } from 'lucide-react';
import { Toast, ToastType } from '@/components/ui/Toast';
import { ShareCustomerModal } from '@/components/customers/ShareCustomerModal';
import { EditableField } from '@/components/customers/EditableField';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CollapsibleSection } from '@/components/ui/CollapsibleSection';
import { CustomerVehicles } from '@/components/customers/CustomerVehicles';
import { CustomerHistory } from '@/components/customers/CustomerHistory';
import { useCustomerDetails } from '@/hooks/useCustomerDetails';
import { useCustomerHistory } from '@/hooks/useCustomerHistory';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';
import { useSession } from 'next-auth/react';
import { MobileLayout } from '@/components/layout/MobileLayout';

export default function CustomerDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams();
  const { data: session } = useSession();
  const customerId = Array.isArray(id) ? id[0] : id;
  const [showShareModal, setShowShareModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');

  const {
    customer,
    loading,
    error,
    editableFields,
    isSaving,
    isOwner,
    updateField,
    deleteCustomer,
    formatPhoneNumber,
    setEditableFields
  } = useCustomerDetails(customerId);

  const { addHistoryItem } = useCustomerHistory(customerId);

  const handleBack = () => {
    router.push('/customers');
  };

  const handleShare = () => {
    if (!customer) return;
    setShowShareModal(true);
  };

  const showErrorToast = (message: string) => {
    setToastMessage(message);
    setToastType('error');
    setShowToast(true);
  };

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setToastType('success');
    setShowToast(true);
  };

  const handleFieldClick = (fieldName: string) => {
    if (!isOwner) return;
    
    setEditableFields(fields =>
      fields.map(field =>
        field.name === fieldName
          ? { ...field, isEditing: true }
          : field
      )
    );
  };

  const handleFieldSave = async (fieldName: string, value: string) => {
    if (value === customer?.[fieldName as keyof typeof customer]) {
      handleFieldCancel(fieldName);
      return;
    }

    const success = await updateField(fieldName, value);
    if (success) {
      try {
        await addHistoryItem('update', `Updated ${fieldName} to "${value}"`);
        showSuccessToast('Customer updated successfully');
      } catch (error) {
        console.error('Failed to track history:', error);
        showSuccessToast('Customer updated successfully');
      }
    } else {
      showErrorToast(ERROR_MESSAGES.SHARE_CUSTOMER);
    }
  };

  const handleFieldCancel = (fieldName: string) => {
    setEditableFields(fields =>
      fields.map(field =>
        field.name === fieldName
          ? { ...field, isEditing: false, value: customer?.[fieldName as keyof typeof customer] as string || '', error: undefined }
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

  const handleDelete = async () => {
    if (!customer) return;
    
    const success = await deleteCustomer();
    if (success) {
      await addHistoryItem('note', 'Customer deleted');
      showSuccessToast('Customer deleted successfully');
      router.push('/customers');
    } else {
      showErrorToast(ERROR_MESSAGES.SHARE_CUSTOMER);
    }
  };

  const handleAddVehicle = () => {
    router.push(`/vehicles/new?customerId=${customerId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <ErrorBoundary>
      <MobileLayout
        header={{
          title: customer.name,
          showBackButton: true,
          onBackClick: handleBack
        }}
        userRole={session?.user?.role as "admin" | "rep"}
        currentPath={pathname}
      >
        <div className="grid grid-cols-1 gap-6">
          <CollapsibleSection title="Customer Information" defaultOpen>
            <div className="space-y-4">
              {editableFields.map(field => (
                <EditableField
                  key={field.name}
                  name={field.name}
                  value={field.value}
                  isEditing={field.isEditing}
                  error={field.error}
                  isOwner={isOwner}
                  onEdit={() => handleFieldClick(field.name)}
                  onSave={(value) => handleFieldSave(field.name, value)}
                  onCancel={() => handleFieldCancel(field.name)}
                  onKeyDown={(e) => handleKeyDown(e, field.name)}
                  formatValue={field.name === 'phone' ? formatPhoneNumber : undefined}
                  placeholder={
                    field.name === 'name' ? 'Name' :
                    field.name === 'email' ? 'Email' :
                    'Phone'
                  }
                  required={field.name === 'name'}
                  setEditableFields={setEditableFields}
                />
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Vehicles">
            <CustomerVehicles
              customer={customer}
              onAddVehicle={handleAddVehicle}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Activity History">
            <CustomerHistory customer={customer} />
          </CollapsibleSection>

          <CollapsibleSection title="Actions">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Button
                    variant="accent"
                    onClick={handleShare}
                    className="p-2"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Share Customer
                    </h4>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
                <div className="flex items-center gap-4">
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    className="p-2"
                    disabled={isSaving}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                  <div>
                    <h4 className="text-sm font-medium text-red-700 dark:text-red-400">
                      Delete Customer
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>
        </div>

        {showToast && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}

        {showShareModal && (
          <ShareCustomerModal
            customer={customer}
            onClose={() => setShowShareModal(false)}
            onSuccess={async () => {
              await addHistoryItem('share', 'Customer shared with team members');
              showSuccessToast(SUCCESS_MESSAGES.SHARE_CUSTOMER);
              setShowShareModal(false);
            }}
          />
        )}
      </MobileLayout>
    </ErrorBoundary>
  );
} 