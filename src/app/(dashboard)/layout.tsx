import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b bg-white dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300">
        <div className="flex h-14 items-center justify-center px-4">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
            Dashboard
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-14 pb-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
    </div>
  )
} 