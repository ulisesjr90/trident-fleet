import { Timestamp } from 'firebase/firestore';

export enum VehicleStatus {
  Available = 'Available',
  WithCustomer = 'With Customer',
  Prospecting = 'Prospecting',
  Maintenance = 'Maintenance',
  Unavailable = 'Unavailable',
  Archived = 'Archived'
}

export interface MaintenanceRecord {
  type: 'oil_change' | 'other';
  date: Timestamp;
  mileage: number;
  note?: string;
  userId: string;
  userName: string;
}

export interface StatusChangeRecord {
  previousStatus: VehicleStatus;
  newStatus: VehicleStatus;
  date: Timestamp;
  mileage: number;
  userId: string;
  userName: string;
  note?: string;
  customerId?: string;
  customerName?: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  role: 'admin' | 'rep';
  vehicleDescriptor: string;
  color: string;
  source?: 'Jay' | 'Avis';
  vin?: string;
  licensePlate: string;
  state?: string | null;
  registrationExpiration?: Timestamp;
  status: VehicleStatus;
  currentMileage?: number;
  milesUntilOilChange?: number;
  maintenanceHistory: MaintenanceRecord[];
  statusHistory: StatusChangeRecord[];
  assignedTo?: string | null;
  customerId?: string | null;
  notes?: string;
  isArchived: boolean;
  archivedAt?: Timestamp;
  archivedBy?: string;
  archiveReason?: string;
  mvaNumber?: string;
  returnDate?: Timestamp;
  createdAt: Date;
  updatedAt: Date;
  currentAssignment?: {
    customer: {
      id: string;
      name: string;
    };
    assignedAt: Date;
    assignedBy: {
      id: string;
      name: string;
    };
  };
  history?: Array<{
    id: string;
    description: string;
    timestamp: Date;
    user: {
      id: string;
      name: string;
    };
    metadata?: {
      customerId?: string;
    };
  }>;
} 