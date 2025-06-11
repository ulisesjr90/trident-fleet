import { Timestamp } from 'firebase/firestore';
import { VehicleStatus } from './vehicle';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  primaryOwnerId: string;
  additionalOwnerIds: string[];
  assignedVehicles?: number;
  vehicles?: {
    id: string;
    vehicleDescriptor: string;
    assignedAt: Timestamp;
    assignedBy: {
      id: string;
      name: string;
    };
    status: VehicleStatus;
  }[];
  history?: CustomerHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerHistory {
  id: string;
  customerId: string;
  type: 'update' | 'share' | 'vehicle' | 'note';
  description: string;
  timestamp: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
  metadata?: {
    vehicleId?: string;
    vehicleDescriptor?: string;
    previousStatus?: string;
    newStatus?: string;
    mileage?: number;
  };
}

export interface ShareCustomerModalProps {
  customer: Pick<Customer, 'id' | 'name' | 'additionalOwnerIds'>;
  onClose: () => void;
  onSuccess: () => void;
} 