import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User as FirebaseUser,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  updateDoc, 
  Timestamp
} from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { UserRole } from '../types/user';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Set persistence to LOCAL
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

const db = getFirestore(app);

// User Interface
export interface UserDocument {
  uid: string;
  email: string;
  role: UserRole;
  lastLogin: Timestamp;
  createdAt: Timestamp;
}

// Activity Tracking
export const trackActivity = async (userId: string, activity: string) => {
  try {
    const userActivityRef = doc(db, 'user_activities', userId);
    
    await updateDoc(userActivityRef, {
      activities: [
        {
          timestamp: Timestamp.now(),
          description: activity
        }
      ]
    }).catch(async (error) => {
      // If document doesn't exist, create it
      if (error.code === 'not-found') {
        await setDoc(userActivityRef, {
          activities: [
            {
              timestamp: Timestamp.now(),
              description: activity
            }
          ]
        });
      }
    });
  } catch (error) {
    console.error('Error tracking activity:', error);
  }
};

// Authentication Functions
export const firebaseAuth = {
  signIn: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  signOutUser: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  sendPasswordResetEmail: async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },

  onAuthChange: (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback);
  }
};

export { app, analytics, auth, db }; 