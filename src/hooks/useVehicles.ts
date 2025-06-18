import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import { Vehicle } from '@/types/vehicle';
import { useAuth } from '@/hooks/useAuth';

const VEHICLES_PER_PAGE = 50;

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();

  const fetchVehicles = async (lastDoc?: any) => {
    try {
      if (!user) {
        setVehicles([]);
        setLoading(false);
        return;
      }

      const vehiclesRef = collection(db, 'vehicles');
      // Fetch vehicles with pagination
      const q = user.role === 'admin'
        ? query(
            vehiclesRef,
            orderBy('createdAt', 'desc'),
            limit(VEHICLES_PER_PAGE),
            ...(lastDoc ? [where('createdAt', '<', lastDoc.createdAt)] : [])
          )
        : query(
            vehiclesRef,
            where('ownerId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(VEHICLES_PER_PAGE),
            ...(lastDoc ? [where('createdAt', '<', lastDoc.createdAt)] : [])
          );

      const querySnapshot = await getDocs(q);
      const vehiclesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vehicle[];

      setVehicles(prev => lastDoc ? [...prev, ...vehiclesData] : vehiclesData);
      setHasMore(querySnapshot.docs.length === VEHICLES_PER_PAGE);
      setError(null);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch vehicles'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [user]);

  const loadMore = async () => {
    if (!hasMore || loading) return;
    const lastVehicle = vehicles[vehicles.length - 1];
    if (lastVehicle) {
      await fetchVehicles(lastVehicle);
    }
  };

  return { vehicles, loading, error, hasMore, loadMore };
} 