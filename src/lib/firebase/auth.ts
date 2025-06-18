import { getAuth, updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ProfileUpdate {
  displayName?: string;
  photoURL?: string;
}

export async function updateProfile(updates: ProfileUpdate): Promise<void> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('No user is currently signed in');
  }

  // Update Firebase Auth profile
  await firebaseUpdateProfile(user, updates);

  // Update Firestore user document
  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: new Date()
  });
} 