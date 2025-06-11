import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import { Vehicle } from '@/types/vehicle';
import { useAuth } from '@/hooks/useAuth';

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        if (!user) {
          setVehicles([]);
          setLoading(false);
          return;
        }

        const vehiclesRef = collection(db, 'vehicles');
        // Fetch all vehicles for all users
        const q = query(vehiclesRef);
        const querySnapshot = await getDocs(q);
        const vehiclesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Vehicle[];
        setVehicles(vehiclesData);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch vehicles'));
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [user]);

  return { vehicles, loading, error };
} 