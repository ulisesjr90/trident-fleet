import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Vehicle } from '@/types/vehicle';

export function useVehicleDetails(vehicleId: string) {
  const { data: session } = useSession();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      console.log('Fetching vehicle:', vehicleId);
      try {
        const vehicleRef = doc(db, 'vehicles', vehicleId);
        const vehicleSnap = await getDoc(vehicleRef);
        
        if (vehicleSnap.exists()) {
          const data = vehicleSnap.data() as Vehicle;
          console.log('Vehicle data loaded:', data);
          setVehicle(data);
        } else {
          console.log('No vehicle found with ID:', vehicleId);
        }
      } catch (err) {
        console.error('Error loading vehicle:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  return {
    vehicle,
    loading,
    isAdmin: session?.user?.role === 'admin'
  };
} 