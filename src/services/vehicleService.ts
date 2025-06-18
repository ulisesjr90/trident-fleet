import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, Timestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Vehicle, VehicleStatus } from '@/types/Vehicle';

export const vehicleService = {
  // Create a new vehicle
  async createVehicle(vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> {
    try {
      const vehiclesRef = collection(db, 'vehicles');
      const newVehicleRef = doc(vehiclesRef);
      const timestamp = Timestamp.now();

      const newVehicle = {
        ...vehicleData,
        id: newVehicleRef.id,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      await setDoc(newVehicleRef, newVehicle);
      return newVehicle;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  },

  // Get all vehicles
  async getAllVehicles(): Promise<Vehicle[]> {
    try {
      const vehiclesRef = collection(db, 'vehicles');
      const q = query(vehiclesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Vehicle));
    } catch (error) {
      console.error('Error getting vehicles:', error);
      throw error;
    }
  },

  // Get a vehicle by ID
  async getVehicleById(id: string): Promise<Vehicle | null> {
    try {
      const vehicleRef = doc(db, 'vehicles', id);
      const snapshot = await getDoc(vehicleRef);
      
      if (!snapshot.exists()) {
        return null;
      }

      return {
        ...snapshot.data(),
        id: snapshot.id
      } as Vehicle;
    } catch (error) {
      console.error('Error getting vehicle:', error);
      throw error;
    }
  },

  // Update a vehicle
  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<void> {
    try {
      const vehicleRef = doc(db, 'vehicles', id);
      await updateDoc(vehicleRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  },

  // Delete a vehicle
  async deleteVehicle(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'vehicles', id));
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  }
}; 