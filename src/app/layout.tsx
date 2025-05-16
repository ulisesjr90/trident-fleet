import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Trident Fleet App',
  description: 'Fleet management application for small-scale operations',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${inter.className} min-h-screen antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}>
        <SessionProvider>
          <ThemeProvider>
          {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
} 