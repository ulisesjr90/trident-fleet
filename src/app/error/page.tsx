'use client'

import { Button } from '@/components/ui/Button'
import { getTypographyClass } from '@/lib/typography'

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className={getTypographyClass('header')}>
          Oops! Something went wrong
            </h1>
        <p className={getTypographyClass('body')}>
          We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
            </p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Refresh Page
            </Button>
      </div>
      <footer className="mt-8 text-center">
        <p className={getTypographyClass('body')}>
          © {new Date().getFullYear()} Trident Fleet App. All rights reserved.
        </p>
      </footer>
    </div>
  )
} 