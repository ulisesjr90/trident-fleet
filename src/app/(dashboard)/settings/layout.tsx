export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b bg-white dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300">
        <div className="flex h-14 items-center justify-center">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
            Settings
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-14 pb-16 bg-white dark:bg-gray-900 transition-colors duration-300 w-full">
        {children}
      </main>
    </div>
  );
} 