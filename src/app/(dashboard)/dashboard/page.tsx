'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AdminDashboard } from "@/components/dashboard/AdminDashboard"
import { RepDashboard } from "@/components/dashboard/RepDashboard"
import { MobileLayout } from '@/components/layout/MobileLayout'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <MobileLayout
      header={{ title: 'Dashboard', showBackButton: false }}
      userRole={session.user.role}
      currentPath="/dashboard"
    >
      {session.user.role === "admin" ? <AdminDashboard /> : <RepDashboard />}
    </MobileLayout>
  )
} 