import { useState } from 'react';
import { collection, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Vehicle, VehicleStatus } from '@/types/vehicle';

interface AddVehicleData {
  vehicleDescriptor: string;
  source: 'Jay' | 'Avis';
  currentMileage: number;
  nextOilChangeDueMileage: number;
  color?: string;
  vin?: string;
  licensePlate?: string | null;
  state?: string | null;
  registrationExpiration?: Date;
  notes?: string;
  status: VehicleStatus;
  isArchived: boolean;
  mvaNumber?: string;
  returnDate?: Date;
}

export function useVehicleOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getVehicle = async (id: string): Promise<Vehicle> => {
    try {
      setIsLoading(true);
      const vehicleRef = doc(db, 'vehicles', id);
      const vehicleSnap = await getDoc(vehicleRef);

      if (!vehicleSnap.exists()) {
        throw new Error('Vehicle not found');
      }

      return { id: vehicleSnap.id, ...vehicleSnap.data() } as Vehicle;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch vehicle'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addVehicle = async (data: AddVehicleData): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const vehicleData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'vehicles'), vehicleData);
      return docRef.id;
    } catch (err) {
      console.error('Error adding vehicle:', err);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateVehicle = async (id: string, data: Partial<Vehicle>) => {
    setIsLoading(true);
    setError(null);

    try {
      const vehicleRef = doc(db, 'vehicles', id);
      await updateDoc(vehicleRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error updating vehicle:', err);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVehicle = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const vehicleRef = doc(db, 'vehicles', id);
      await deleteDoc(vehicleRef);
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getVehicle,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    isLoading,
    error,
  };
} 