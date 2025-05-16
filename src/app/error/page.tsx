'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'CredentialsSignin':
        return 'Invalid email or password'
      case 'AccessDenied':
        return 'You do not have access to this resource'
      case 'SessionRequired':
        return 'Please sign in to access this page'
      default:
        return 'An error occurred. Please try again.'
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-50 dark:bg-gray-900 py-6 sm:py-12">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm px-2 sm:px-8 py-6 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="flex flex-col items-center space-y-2 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Error
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              {getErrorMessage(error)}
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <Button
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Link href="/">
                Return to Login
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-xs text-gray-400 dark:text-gray-600">
        &copy; {new Date().getFullYear()} Trident Fleet. All rights reserved.
      </footer>
    </div>
  )
} 