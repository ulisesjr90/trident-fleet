'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState('/dashboard')

  useEffect(() => {
    // Get redirect URL from cookie if it exists
    const cookies = document.cookie.split(';')
    const redirectCookie = cookies.find(cookie => cookie.trim().startsWith('redirect-url='))
    if (redirectCookie) {
      const url = redirectCookie.split('=')[1]
      setRedirectUrl(decodeURIComponent(url))
      // Remove the cookie
      document.cookie = 'redirect-url=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('Starting login process...')
      
      // Sign in with Firebase
      console.log('Attempting Firebase sign in...')
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      console.log('Firebase sign in successful:', { uid: user.uid, email: user.email })

      // Get user data from Firestore
      console.log('Fetching user data from Firestore...')
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      const userData = userDoc.data()
      console.log('Firestore user data:', userData)

      if (!userData) {
        throw new Error('User data not found in Firestore')
      }

      // Store user data in localStorage for client-side access
      localStorage.setItem('user', JSON.stringify({
        id: user.uid,
        email: user.email,
        name: user.displayName,
        role: userData.role || 'rep'
      }))

      // Get the ID token and set it as a cookie
      const idToken = await user.getIdToken()
      console.log('Setting auth token cookie...');
      document.cookie = `auth-token=${idToken}; path=/; secure; samesite=lax`
      document.cookie = `user-role=${userData.role || 'rep'}; path=/; secure; samesite=lax`
      console.log('Cookies after setting:', document.cookie);

      console.log('Login successful, redirecting to:', redirectUrl)
      // Wait for auth state to be updated
      await new Promise((resolve) => {
        console.log('Waiting for auth state update...');
        const unsubscribe = auth.onAuthStateChanged((user) => {
          console.log('Auth state updated:', { user: user?.uid });
          if (user) {
            unsubscribe()
            resolve(true)
          }
        })
      })
      
      console.log('Forcing hard navigation to:', redirectUrl);
      // Force a hard navigation to ensure the middleware picks up the new auth state
      window.location.href = redirectUrl
    } catch (error) {
      console.error('Login error details:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An error occurred during login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      console.log('Sending password reset email...')
      await sendPasswordResetEmail(auth, email)
      console.log('Password reset email sent successfully')
      setResetSent(true)
    } catch (error) {
      console.error('Password reset error details:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Failed to send password reset email. Please check your email address.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Trident Fleet App
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>

        <Card className="bg-white dark:bg-[#1A1A1A]">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  placeholder="Email address"
                />
              </div>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-12"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-md bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200">
                  {error}
                </div>
              )}

              {resetSent && (
                <div className="p-3 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200">
                  Password reset email sent. Please check your inbox.
                </div>
              )}

              <div className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          </div>
        </Card>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Need help? Contact your administrator</p>
        </div>
      </div>
    </div>
  )
} 