'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTheme } from '@/components/providers/ThemeProvider'

type ToastType = 'error' | 'success'

// Debug logging function
function debugLog(message: string, data?: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Login Debug] ${message}`, data ? data : '')
  }
}

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const { isDarkMode } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  // Log session status changes
  useEffect(() => {
    debugLog('Session status changed:', { status, session })
  }, [status, session])

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
      debugLog('User authenticated, redirecting to:', callbackUrl)
      router.push(callbackUrl)
    }
  }, [status, router, searchParams])

  const showToast = (message: string, type: ToastType) => {
    debugLog('Showing toast:', { message, type })
    setToast({ message, type })
    // Auto-hide toast after 5 seconds
    setTimeout(() => setToast(null), 5000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    debugLog('Form submitted with:', { email })
    setIsLoading(true)

    try {
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
      debugLog('Attempting sign in with callback URL:', callbackUrl)
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      debugLog('Sign in result:', result)

      if (result?.error) {
        debugLog('Sign in error:', result.error)
        showToast('Invalid email or password', 'error')
        return
      }

      if (result?.url) {
        debugLog('Redirecting to result URL:', result.url)
        router.push(result.url)
      } else {
        debugLog('Redirecting to callback URL:', callbackUrl)
        router.push(callbackUrl)
      }
    } catch (error) {
      debugLog('Login error:', error)
      showToast('An error occurred during login', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking session
  if (status === 'loading') {
    debugLog('Session loading, showing spinner')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Welcome to Trident Fleet
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Sign in to manage your fleet operations
          </p>
        </div>

        <Card className="bg-white dark:bg-[#1A1A1A] transition-colors duration-300">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Email address
                </label>
                <div className="mt-1">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Password
                </label>
                <div className="mt-1">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {toast && (
                <div className={`p-3 rounded-md ${
                  toast.type === 'error' 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200'
                }`}>
                  {toast.message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </div>
        </Card>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
          <p>Need help? Contact your administrator</p>
        </div>
      </div>
    </div>
  )
} 