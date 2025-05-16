import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { VehicleStatus } from '@/components/vehicles/VehicleCard';

export interface Vehicle {
  id: string;
  name: string;
  status: VehicleStatus;
  mileage: number;
  lastServiceDate?: string;
  currentCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const vehiclesRef = collection(db, 'vehicles');
    const q = query(vehiclesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const vehiclesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Vehicle[];

        setVehicles(vehiclesData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching vehicles:', error);
        setError(error as Error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { vehicles, isLoading, error };
} 