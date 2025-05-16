import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"

// Debug logging function
function debugLog(message: string, data?: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Auth Debug] ${message}`, data ? data : '')
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        debugLog('Authorize called with credentials:', { email: credentials?.email })
        
        if (!credentials?.email || !credentials?.password) {
          debugLog('Missing credentials')
          throw new Error("Email and password required")
        }

        try {
          debugLog('Attempting Firebase sign in')
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          )

          const user = userCredential.user
          debugLog('Firebase sign in successful', { uid: user.uid })
          
          // Get user role from Firestore
          debugLog('Fetching user role from Firestore')
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          const userData = userDoc.data()
          debugLog('User data from Firestore:', userData)
          
          // Update last login time
          debugLog('Updating last login time')
          await setDoc(doc(db, 'users', user.uid), {
            lastLoginAt: new Date().toISOString()
          }, { merge: true })

          const userToReturn = {
            id: user.uid,
            email: user.email,
            name: user.displayName,
            role: userData?.role || 'rep' // Get role from Firestore, default to 'rep' if not set
          }
          debugLog('Returning user:', userToReturn)
          return userToReturn
        } catch (error) {
          debugLog('Auth error:', error)
          throw new Error("Invalid email or password")
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      debugLog('JWT callback called', { token, user })
      if (user) {
        token.id = user.id
        token.role = user.role
        debugLog('Updated token with user data:', token)
      }
      return token
    },
    async session({ session, token }) {
      debugLog('Session callback called', { session, token })
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        debugLog('Updated session with token data:', session)
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/",
    error: "/error"
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET
} 