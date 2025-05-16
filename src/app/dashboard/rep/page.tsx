import { Metadata } from "next"
import { Car, Users, Calendar, MessageSquare } from "lucide-react"

export const metadata: Metadata = {
  title: "Representative Dashboard | Trident Fleet",
  description: "Representative dashboard for fleet management",
}

export default function RepDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#1A1A1A]">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b bg-white dark:bg-[#1A1A1A] dark:border-gray-800">
        <div className="flex h-14 items-center justify-center px-4">
          <h1 className="text-lg font-semibold text-[#333333] dark:text-white">
            Representative Dashboard
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
                  My Vehicles
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
                  My Customers
                </h3>
              </div>
              <p className="mt-2 text-2xl font-bold text-[#333333] dark:text-white">
                0
              </p>
            </div>
            <div className="rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#0066CC]" />
                <h3 className="text-sm font-medium text-[#333333] dark:text-white">
                  Today's Appointments
                </h3>
              </div>
              <p className="mt-2 text-2xl font-bold text-[#333333] dark:text-white">
                0
              </p>
            </div>
            <div className="rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#0066CC]" />
                <h3 className="text-sm font-medium text-[#333333] dark:text-white">
                  Pending Messages
                </h3>
              </div>
              <p className="mt-2 text-2xl font-bold text-[#333333] dark:text-white">
                0
              </p>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-[#333333] dark:text-white">
              Today's Schedule
            </h2>
            <div className="mt-4 rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-[#1A1A1A]">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No appointments scheduled for today
              </p>
            </div>
          </div>

          {/* Recent Messages */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-[#333333] dark:text-white">
              Recent Messages
            </h2>
            <div className="mt-4 rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-[#1A1A1A]">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No recent messages
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 