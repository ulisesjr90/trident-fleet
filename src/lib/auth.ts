import { User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export interface AuthUser extends User {
  role?: 'admin' | 'rep'
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const user = auth.currentUser
  if (!user) return null

  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    const userData = userDoc.data()
    
    return {
      ...user,
      role: userData?.role || 'rep'
    }
  } catch (error) {
    console.error('Error getting user data:', error)
    return null
  }
}

export async function getUserRole(uid: string): Promise<'admin' | 'rep'> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    const userData = userDoc.data()
    return userData?.role || 'rep'
  } catch (error) {
    console.error('Error getting user role:', error)
    return 'rep'
  }
} 