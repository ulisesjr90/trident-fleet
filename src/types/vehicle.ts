import { Timestamp } from 'firebase/firestore';

export enum VehicleStatus {
  Available = 'Available',
  WithCustomer = 'With Customer',
  Prospecting = 'Prospecting',
  Maintenance = 'Maintenance',
  Unavailable = 'Unavailable',
  Archived = 'Archived'
}

export interface Vehicle {
  id: string;
  vehicleDescriptor: string;
  color?: string;
  source?: 'Jay' | 'Avis';
  vin?: string;
  licensePlate?: string | null;
  state?: string | null;
  registrationExpiration?: Timestamp;
  status: VehicleStatus;
  currentMileage: number;
  nextOilChangeDueMileage: number;
  assignedTo?: string | null;
  customerId?: string | null;
  notes?: string;
  isArchived: boolean;
  archivedAt?: Timestamp;
  archivedBy?: string;
  archiveReason?: string;
  mvaNumber?: string;
  returnDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
} 