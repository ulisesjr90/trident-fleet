import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import { Vehicle, VehicleStatus } from '@/types/vehicle';

export function useVehicleDetails(vehicleId: string) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setVehicle(null);
          setLoading(false);
          return;
        }

        const vehicleRef = doc(db, 'vehicles', vehicleId);
        const vehicleDoc = await getDoc(vehicleRef);

        if (vehicleDoc.exists()) {
          setVehicle({ id: vehicleDoc.id, ...vehicleDoc.data() } as Vehicle);
        } else {
          setVehicle(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch vehicle details'));
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicleDetails();
    }
  }, [vehicleId]);

  const updateStatus = async (newStatus: VehicleStatus, newMileage: number) => {
    if (!vehicle) {
      console.error('UpdateStatus: No vehicle found');
      return false;
    }
    
    try {
      // Validate mileage
      if (newMileage < (vehicle.currentMileage || 0)) {
        throw new Error('New mileage cannot be less than current mileage');
      }

      // Calculate miles until next oil change
      const milesUntilOilChange = vehicle.milesUntilOilChange 
        ? vehicle.milesUntilOilChange - (newMileage - (vehicle.currentMileage || 0))
        : 5000;

      // Update vehicle in a single operation
      await updateDoc(doc(db, 'vehicles', vehicle.id), {
        status: newStatus,
        currentMileage: newMileage,
        milesUntilOilChange,
        updatedAt: serverTimestamp()
      });
      
      // Update local state
      setVehicle(prev => prev ? {
        ...prev,
        status: newStatus,
        currentMileage: newMileage,
        milesUntilOilChange
      } : null);
      
      return true;
} catch (error) {
       console.error('UpdateStatus - Error:', error);
       return false;
     }
   };

  const updateField = async (fieldName: string, value: string | number | null) => {
    if (!vehicle) return false;

    try {
      setIsSaving(true);
      const vehicleRef = doc(db, 'vehicles', vehicle.id);
      await updateDoc(vehicleRef, {
        [fieldName]: value,
        updatedAt: serverTimestamp()
      });

      setVehicle(prev => prev ? { ...prev, [fieldName]: value } : null);
      return true;
    } catch (err) {
      console.error('Error updating vehicle:', err);
      setError(err instanceof Error ? err : new Error('Failed to update vehicle'));
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    vehicle,
    loading,
    error,
    isSaving,
    updateField,
    updateStatus,
    setVehicle
  };
} 