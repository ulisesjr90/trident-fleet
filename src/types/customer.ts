export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  primaryOwnerId: string;
  additionalOwnerIds: string[];
  assignedVehicles?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShareCustomerModalProps {
  customer: Pick<Customer, 'id' | 'name' | 'additionalOwnerIds'>;
  onClose: () => void;
  onSuccess: () => void;
} 