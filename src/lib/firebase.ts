import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBig3Iukc8g2keNNKcg-I2beM1zHX9rDmY",
  authDomain: "trident-fleet-app-ad0d5.firebaseapp.com",
  projectId: "trident-fleet-app-ad0d5",
  storageBucket: "trident-fleet-app-ad0d5.firebasestorage.app",
  messagingSenderId: "15558931551",
  appId: "1:15558931551:web:83cae0e022919a451397ea"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }; 