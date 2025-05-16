'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate email format
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    // Validate password
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-50 dark:bg-gray-900 py-6 sm:py-12">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm px-2 sm:px-8 py-6 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="flex flex-col items-center space-y-2 mb-2">
            <Image 
              src="/logo-placeholder.png" 
              alt="Trident Logo" 
              width={64} 
              height={64} 
              className="rounded-full shadow-md" 
            />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Trident Fleet
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
              Sign in to manage your fleet
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white dark:bg-gray-800"
            />
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white dark:bg-gray-800 pr-12"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="text-right">
              <Link 
                href="/auth/forgot-password" 
                className="text-xs text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {error && (
              <div className="rounded bg-red-100 dark:bg-red-900/30 p-2 text-red-700 dark:text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90" 
              isLoading={isLoading}
            >
              Sign in
            </Button>
          </form>
        </div>
      </div>

      <footer className="mt-8 text-center text-xs text-gray-400 dark:text-gray-600">
        &copy; {new Date().getFullYear()} Trident Fleet. All rights reserved.
      </footer>
    </div>
  )
} 