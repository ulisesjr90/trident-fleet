import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin
const apps = getApps();

if (!apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '')
      : undefined;

    if (!privateKey) {
      throw new Error('FIREBASE_PRIVATE_KEY is not set');
    }

    if (!process.env.FIREBASE_PROJECT_ID) {
      throw new Error('FIREBASE_PROJECT_ID is not set');
    }

    if (!process.env.FIREBASE_CLIENT_EMAIL) {
      throw new Error('FIREBASE_CLIENT_EMAIL is not set');
    }

    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw error;
  }
}

export const adminAuth = getAuth();

// Helper function to set custom claims
export async function setUserRole(uid: string, role: 'admin' | 'rep') {
  try {
    await adminAuth.setCustomUserClaims(uid, { role });
    return true;
  } catch (error) {
    console.error('Error setting custom claims:', error);
    return false;
  }
}

// Helper function to get user role
export async function getUserRole(uid: string) {
  try {
    const user = await adminAuth.getUser(uid);
    return user.customClaims?.role || 'rep';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'rep';
  }
} 