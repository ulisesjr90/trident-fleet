import { 
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserRole } from '../types/user';

export interface FirestoreUser {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  status: 'active' | 'inactive';
  createdAt: Timestamp;
  lastLogin: Timestamp | null;
}

// Helper function to normalize role
const normalizeRole = (role: string): UserRole => {
  const normalizedRole = role.toLowerCase();
  return normalizedRole === 'admin' ? UserRole.ADMIN : UserRole.REP;
};

export const userService = {
  // Create a new user document
  async createUser(userData: Omit<FirestoreUser, 'createdAt' | 'lastLogin'>): Promise<FirestoreUser> {
    try {
      const userDoc = {
        ...userData,
        role: normalizeRole(userData.role),
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now()
      };

      await setDoc(doc(db, 'users', userData.uid), userDoc);
      return userDoc;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Get user by ID
  async getUserById(uid: string): Promise<FirestoreUser | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data();
      return {
        ...data,
        role: normalizeRole(data.role),
        uid: userDoc.id
      } as FirestoreUser;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // Get all users
  async getAllUsers(): Promise<FirestoreUser[]> {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          role: normalizeRole(data.role),
          uid: doc.id
        } as FirestoreUser;
      });
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  },

  // Get users by role
  async getUsersByRole(role: UserRole): Promise<FirestoreUser[]> {
    try {
      const usersRef = collection(db, 'users');
      // Use case-insensitive query by converting both to lowercase
      const q = query(usersRef, where('role', '==', role.toLowerCase()));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          role: normalizeRole(data.role),
          uid: doc.id
        } as FirestoreUser;
      });
    } catch (error) {
      console.error('Error getting users by role:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(uid: string, updates: Partial<FirestoreUser>): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error('User document does not exist');
      }

      // Normalize role if it's being updated
      const normalizedUpdates = {
        ...updates,
        role: updates.role ? normalizeRole(updates.role) : undefined
      };

      await updateDoc(userRef, normalizedUpdates);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Update user's last login
  async updateLastLogin(uid: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error('User document does not exist');
      }

      await updateDoc(userRef, {
        lastLogin: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  },

  // Delete user
  async deleteUser(uid: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error('User document does not exist');
      }

      await deleteDoc(userRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Update user status
  async updateUserStatus(uid: string, status: 'active' | 'inactive'): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { status });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }
}; 