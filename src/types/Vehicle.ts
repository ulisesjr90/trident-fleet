import { Timestamp } from 'firebase/firestore';

export type VehicleStatus = 'Available' | 'With Customer' | 'Maintenance' | 'Prospecting' | 'Archived' | 'Unavailable';

export type VehicleType = 'Sedan' | 'Coupe' | 'SUV' | 'Crossover' | 'Pickup';

export interface Vehicle {
  id?: string;
  vehicleDescriptor: string;
  source: string;
  type?: VehicleType;
  currentMileage: number;
  nextOilChangeDueMileage: number;
  color: string;
  vin: string;
  licensePlate: string;
  state: string;
  registrationExpiration: string | null;
  notes: string;
  status: VehicleStatus;
  mvaNumber: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
} 