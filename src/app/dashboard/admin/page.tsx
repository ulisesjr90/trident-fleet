import { Metadata } from "next"
import { Car, Users, UserCog, Settings, Shield, BarChart } from "lucide-react"

export const metadata: Metadata = {
  title: "Admin Dashboard | Trident Fleet",
  description: "Administrative dashboard for fleet management",
}

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#1A1A1A]">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b bg-white dark:bg-[#1A1A1A] dark:border-gray-800">
        <div className="flex h-14 items-center justify-center px-4">
          <h1 className="text-lg font-semibold text-[#333333] dark:text-white">
            Admin Dashboard
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-14 pb-16">
        <div className="container px-4 py-6">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-[#0066CC]" />
                <h3 className="text-sm font-medium text-[#333333] dark:text-white">
                  Active Vehicles
                </h3>
              </div>
              <p className="mt-2 text-2xl font-bold text-[#333333] dark:text-white">
                0
              </p>
            </div>
            <div className="rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#0066CC]" />
                <h3 className="text-sm font-medium text-[#333333] dark:text-white">
                  Total Customers
                </h3>
              </div>
              <p className="mt-2 text-2xl font-bold text-[#333333] dark:text-white">
                0
              </p>
            </div>
            <div className="rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <UserCog className="h-5 w-5 text-[#0066CC]" />
                <h3 className="text-sm font-medium text-[#333333] dark:text-white">
                  Active Users
                </h3>
              </div>
              <p className="mt-2 text-2xl font-bold text-[#333333] dark:text-white">
                0
              </p>
            </div>
            <div className="rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#0066CC]" />
                <h3 className="text-sm font-medium text-[#333333] dark:text-white">
                  Pending Tasks
                </h3>
              </div>
              <p className="mt-2 text-2xl font-bold text-[#333333] dark:text-white">
                0
              </p>
            </div>
          </div>

          {/* Admin Specific Stats */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#0066CC]" />
                <h3 className="text-sm font-medium text-[#333333] dark:text-white">
                  System Health
                </h3>
              </div>
              <p className="mt-2 text-2xl font-bold text-[#22C55E] dark:text-[#22C55E]">
                Healthy
              </p>
            </div>
            <div className="rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-[#0066CC]" />
                <h3 className="text-sm font-medium text-[#333333] dark:text-white">
                  Monthly Revenue
                </h3>
              </div>
              <p className="mt-2 text-2xl font-bold text-[#333333] dark:text-white">
                $0
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-[#333333] dark:text-white">
              Recent Activity
            </h2>
            <div className="mt-4 rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-[#1A1A1A]">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No recent activity
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 