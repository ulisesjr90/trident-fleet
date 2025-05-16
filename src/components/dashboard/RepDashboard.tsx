import { Car, Users, MessageSquare } from "lucide-react"

export function RepDashboard() {
  return (
    <div className="container px-4 py-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-[#1f2937]">
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
        <div className="rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-[#1f2937]">
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
        <div className="rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-[#1f2937]">
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

      {/* Recent Messages */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-[#333333] dark:text-white">
          Recent Messages
        </h2>
        <div className="mt-4 rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-[#1f2937]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No recent messages
          </p>
        </div>
      </div>
    </div>
  )
} 