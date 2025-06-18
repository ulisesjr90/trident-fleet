'use client'

import { useEffect, useState } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { PageLayout } from '@/components/layout/PageLayout'
import { getTypographyClass } from '@/lib/typography'
import { Truck, CheckCircle, AlertTriangle, Users, Calendar, Wrench, Plus, Car, ArrowRight } from 'lucide-react'
import { VehicleStatus } from '@/types/vehicle'
import { useRouter } from 'next/navigation'
import { useVehicles } from '@/hooks/useVehicles'
import { useCustomers } from '@/hooks/useCustomers'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface VehicleStats {
  totalVehicles: number
  availableVehicles: number
  maintenanceVehicles: number
  withCustomerVehicles: number
  prospectingVehicles: number
  expiringRegistrationVehicles: number
  maintenanceDueVehicles: number
  totalCustomers: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { vehicles, loading: vehiclesLoading, error: vehiclesError } = useVehicles()
  const { customers, loading: customersLoading, error: customersError } = useCustomers()
  const [stats, setStats] = useState<VehicleStats>({
    totalVehicles: 0,
    availableVehicles: 0,
    maintenanceVehicles: 0,
    withCustomerVehicles: 0,
    prospectingVehicles: 0,
    expiringRegistrationVehicles: 0,
    maintenanceDueVehicles: 0,
    totalCustomers: 0,
  })

  useEffect(() => {
    if (!vehiclesLoading && !customersLoading) {
      // Calculate stats with more detailed vehicle status
      const now = new Date()
      const expirationThreshold = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate())

        setStats({
          totalVehicles: vehicles.length,
        availableVehicles: vehicles.filter(v => v.status === VehicleStatus.Available).length,
        maintenanceVehicles: vehicles.filter(v => v.status === VehicleStatus.Maintenance).length,
        withCustomerVehicles: vehicles.filter(v => v.status === VehicleStatus.WithCustomer).length,
        prospectingVehicles: vehicles.filter(v => v.status === VehicleStatus.Prospecting).length,
        expiringRegistrationVehicles: vehicles.filter(v => 
          v.registrationExpiration && 
          new Date(v.registrationExpiration.toDate()) <= expirationThreshold
        ).length,
        maintenanceDueVehicles: vehicles.filter(v => 
          v.milesUntilOilChange !== undefined && 
          v.milesUntilOilChange <= 500 // Maintenance due within 500 miles
        ).length,
          totalCustomers: customers.length,
      })
    }
  }, [vehicles, customers, vehiclesLoading, customersLoading])

  // Helper function to navigate to vehicles page with filter
  const navigateToVehicles = (filterParam: string) => {
    switch(filterParam) {
      case 'all':
        router.push('/vehicles');
        break;
      case VehicleStatus.Available:
      case VehicleStatus.Maintenance:
      case VehicleStatus.WithCustomer:
      case VehicleStatus.Prospecting:
        router.push(`/vehicles?filter=status&value=${encodeURIComponent(filterParam)}`);
        break;
      case 'expiring-registration':
        router.push('/vehicles?filter=maintenance&value=registrationExpired');
        break;
      case 'maintenance-due':
        router.push('/vehicles?filter=maintenance&value=needsOilChange');
        break;
      default:
        router.push('/vehicles');
    }
  }

  // Get prospecting vehicles for current user
  const prospectingVehicles = vehicles.filter(v => {
    console.log('Checking vehicle:', {
      vehicleDescriptor: v.vehicleDescriptor,
      status: v.status,
      assignedTo: v.assignedTo,
      userId: user?.uid,
      statusHistory: v.statusHistory
    });

    if (v.status !== VehicleStatus.Prospecting) {
      console.log('Vehicle not in Prospecting status');
      return false;
    }
    
    // Check if vehicle is directly assigned to user
    if (v.assignedTo === user?.uid) {
      console.log('Vehicle directly assigned to user');
      return true;
    }
    
    // Check status history for the most recent status change by current user
    if (v.statusHistory && v.statusHistory.length > 0) {
      const latestStatusChange = v.statusHistory[v.statusHistory.length - 1];
      console.log('Latest status change:', latestStatusChange);
      const isUserLatestChange = latestStatusChange.userId === user?.uid && 
             latestStatusChange.newStatus === VehicleStatus.Prospecting;
      console.log('Is user latest change:', isUserLatestChange);
      return isUserLatestChange;
    }
    
    console.log('No matching conditions found');
    return false;
  });

  console.log('Filtered prospecting vehicles:', prospectingVehicles);

  if (vehiclesLoading || customersLoading) {
    return (
      <PageLayout title="Dashboard">
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
      </PageLayout>
    )
  }

  if (vehiclesError || customersError) {
    return (
      <PageLayout title="Dashboard">
      <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
          <p className={getTypographyClass('body')}>
            Error loading dashboard: {vehiclesError?.message || customersError?.message || 'An error occurred'}
          </p>
      </div>
      </PageLayout>
    )
  }

  // Rep Dashboard Layout
  if (user?.role === 'rep') {
    return (
      <PageLayout title="My Dashboard">
        {/* Prospecting Vehicle Banner */}
        {prospectingVehicles.length > 0 && (
          <Link href={`/vehicles/${prospectingVehicles[0].id}`}>
            <div className="fixed top-14 md:left-64 lg:left-64 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 shadow-md z-40 transition-all duration-300 cursor-pointer hover:from-blue-700 hover:to-blue-900">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="py-3">
                  {/* Mobile Layout */}
                  <div className="md:hidden flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100 text-sm">Current checked out vehicle:</span>
                      <span className="text-blue-100 text-sm">
                        Since {prospectingVehicles[0].statusHistory[prospectingVehicles[0].statusHistory.length - 1].date.toDate().toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-white font-medium">
                      {prospectingVehicles[0].vehicleDescriptor}
                      {prospectingVehicles[0].color && (
                        <span className="text-blue-100"> • {prospectingVehicles[0].color}</span>
                      )}
                    </span>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-blue-100 text-sm whitespace-nowrap">Current checked out vehicle:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          {prospectingVehicles[0].vehicleDescriptor}
                          {prospectingVehicles[0].color && (
                            <span className="text-blue-100"> • {prospectingVehicles[0].color}</span>
                          )}
                        </span>
                      </div>
                    </div>
                    <span className="text-blue-100 text-sm whitespace-nowrap">
                      Since {prospectingVehicles[0].statusHistory[prospectingVehicles[0].statusHistory.length - 1].date.toDate().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}
        <div className="mt-16">
          {/* Desktop View */}
          <div className="hidden md:block">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Vehicles */}
              <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => navigateToVehicles('all')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Total Vehicles</p>
                    <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.totalVehicles}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Available Vehicles */}
              <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => navigateToVehicles(VehicleStatus.Available)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Available Vehicles</p>
                    <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.availableVehicles}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              {/* Vehicles with My Customers */}
              <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => navigateToVehicles(VehicleStatus.WithCustomer)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>With My Customers</p>
                    <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.withCustomerVehicles}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Total Prospecting */}
              <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => navigateToVehicles(VehicleStatus.Prospecting)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Total Prospecting</p>
                    <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.prospectingVehicles}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>

              {/* In Maintenance */}
              <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => navigateToVehicles(VehicleStatus.Maintenance)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>In Maintenance</p>
                    <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.maintenanceVehicles}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <Wrench className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Oil Change Due Soon */}
              <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => navigateToVehicles('maintenance-due')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Oil Change Due Soon</p>
                    <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.maintenanceDueVehicles}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Wrench className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>

              {/* Registration Expiring Soon */}
              <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => navigateToVehicles('expiring-registration')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Registration Expiring Soon</p>
                    <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.expiringRegistrationVehicles}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-6">
          {/* Total Vehicles */}
          <div 
            className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            onClick={() => navigateToVehicles('all')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Total Vehicles</p>
                <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.totalVehicles}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Available Vehicles */}
          <div 
            className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            onClick={() => navigateToVehicles(VehicleStatus.Available)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Available Vehicles</p>
                <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.availableVehicles}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Vehicles with My Customers */}
          <div 
            className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            onClick={() => navigateToVehicles(VehicleStatus.WithCustomer)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>With My Customers</p>
                <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.withCustomerVehicles}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          {/* Total Prospecting */}
          <div 
            className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            onClick={() => navigateToVehicles(VehicleStatus.Prospecting)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Total Prospecting</p>
                <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.prospectingVehicles}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          {/* In Maintenance */}
          <div 
            className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            onClick={() => navigateToVehicles(VehicleStatus.Maintenance)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>In Maintenance</p>
                <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.maintenanceVehicles}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Oil Change Due Soon */}
          <div 
            className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            onClick={() => navigateToVehicles('maintenance-due')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Oil Change Due Soon</p>
                <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.maintenanceDueVehicles}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          {/* Registration Expiring Soon */}
          <div 
            className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            onClick={() => navigateToVehicles('expiring-registration')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Registration Expiring Soon</p>
                <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.expiringRegistrationVehicles}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  // Admin Dashboard Layout
  return (
    <PageLayout title="Dashboard">
      {/* Prospecting Vehicle Banner */}
      {prospectingVehicles.length > 0 && (
        <Link href={`/vehicles/${prospectingVehicles[0].id}`}>
          <div className="fixed top-14 md:left-64 lg:left-64 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 shadow-md z-40 transition-all duration-300 cursor-pointer hover:from-blue-700 hover:to-blue-900">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="py-3">
                {/* Mobile Layout */}
                <div className="md:hidden flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100 text-sm">Current checked out vehicle:</span>
                    <span className="text-blue-100 text-sm">
                      Since {prospectingVehicles[0].statusHistory[prospectingVehicles[0].statusHistory.length - 1].date.toDate().toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-white font-medium">
                    {prospectingVehicles[0].vehicleDescriptor}
                    {prospectingVehicles[0].color && (
                      <span className="text-blue-100"> • {prospectingVehicles[0].color}</span>
                    )}
                  </span>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-blue-100 text-sm whitespace-nowrap">Current checked out vehicle:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">
                        {prospectingVehicles[0].vehicleDescriptor}
                        {prospectingVehicles[0].color && (
                          <span className="text-blue-100"> • {prospectingVehicles[0].color}</span>
                        )}
                      </span>
                    </div>
                  </div>
                  <span className="text-blue-100 text-sm whitespace-nowrap">
                    Since {prospectingVehicles[0].statusHistory[prospectingVehicles[0].statusHistory.length - 1].date.toDate().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}
      <div className="mt-16">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Vehicles */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            onClick={() => navigateToVehicles('all')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Total Vehicles</p>
                <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.totalVehicles}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Available Vehicles */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            onClick={() => navigateToVehicles(VehicleStatus.Available)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Available Vehicles</p>
                <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.availableVehicles}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Total Customers */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            onClick={() => router.push('/customers')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Total Customers</p>
                <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.totalCustomers}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          {/* Vehicles in Maintenance */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            onClick={() => navigateToVehicles(VehicleStatus.Maintenance)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Vehicles in Maintenance</p>
                <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.maintenanceVehicles}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Vehicles with Customers */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            onClick={() => navigateToVehicles(VehicleStatus.WithCustomer)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Vehicles with Customers</p>
                <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.withCustomerVehicles}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Vehicles Prospecting */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            onClick={() => navigateToVehicles(VehicleStatus.Prospecting)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Vehicles Prospecting</p>
                <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.prospectingVehicles}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          {/* Vehicles with Expiring Registration */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            onClick={() => navigateToVehicles('expiring-registration')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Expiring Registration</p>
                <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.expiringRegistrationVehicles}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          {/* Maintenance Due */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            onClick={() => navigateToVehicles('maintenance-due')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Maintenance Due</p>
                <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.maintenanceDueVehicles}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View - Similar changes for mobile cards */}
      <div className="md:hidden space-y-6">
        <div className="space-y-4">
          {/* Prospecting Vehicle Banner */}
          {prospectingVehicles.length > 0 && (
            <div className="space-y-4">
              {/* Prospecting Vehicle Banner */}
              <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Car className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                          <span className="text-white font-medium">
                            {prospectingVehicles[0].vehicleDescriptor}
                            {prospectingVehicles[0].color && (
                              <span className="text-blue-100"> • {prospectingVehicles[0].color}</span>
                            )}
                          </span>
                          <span className="text-blue-100 text-sm">
                            Checked out {prospectingVehicles[0].statusHistory[prospectingVehicles[0].statusHistory.length - 1].date.toDate().toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Link 
                        href="/vehicles/prospecting"
                        className="flex items-center text-sm text-white hover:text-blue-100 transition-colors"
                      >
                        View Details
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Vehicles */}
              <div 
                className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => navigateToVehicles('all')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Total Vehicles</p>
                    <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.totalVehicles}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Available Vehicles */}
              <div 
                className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => navigateToVehicles(VehicleStatus.Available)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Available Vehicles</p>
                    <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.availableVehicles}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              {/* Vehicles in Maintenance */}
              <div 
                className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => navigateToVehicles(VehicleStatus.Maintenance)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Vehicles in Maintenance</p>
                    <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.maintenanceVehicles}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <Wrench className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Vehicles with Customers */}
              <div 
                className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => navigateToVehicles(VehicleStatus.WithCustomer)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Vehicles with Customers</p>
                    <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.withCustomerVehicles}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Vehicles Prospecting */}
              <div 
                className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => navigateToVehicles(VehicleStatus.Prospecting)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Vehicles Prospecting</p>
                    <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.prospectingVehicles}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>

              {/* Vehicles with Expiring Registration */}
              <div 
                className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => navigateToVehicles('expiring-registration')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Expiring Registration</p>
                    <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.expiringRegistrationVehicles}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </div>

              {/* Maintenance Due */}
              <div 
                className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => navigateToVehicles('maintenance-due')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Maintenance Due</p>
                    <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.maintenanceDueVehicles}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Wrench className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>

              {/* Total Customers */}
              <div 
                className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => router.push('/customers')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={getTypographyClass('body')} style={{ color: 'var(--gray-500)' }}>Total Customers</p>
                    <h3 className={getTypographyClass('header')} style={{ margin: 0 }}>{stats.totalCustomers}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
} 