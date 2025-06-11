import { initializeApp, getApps, cert } from 'firebase-admin/app';

export function initializeAdminApp() {
  const apps = getApps();
  
  if (apps.length === 0) {
    try {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined;

      if (!privateKey) {
        console.error('FIREBASE_PRIVATE_KEY is not set');
        return;
      }

      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID || '',
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
          privateKey
        })
      });

      console.log('Firebase Admin App Initialized');
    } catch (error) {
      console.error('Firebase Admin initialization error:', error);
    }
  }
} 