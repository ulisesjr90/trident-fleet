'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { AddVehicleModal } from '@/components/vehicles/AddVehicleModal';
import { EditVehicleModal } from '@/components/vehicles/EditVehicleModal';
import { useVehicles } from '@/hooks/useVehicles';
import { useVehicleOperations } from '@/hooks/useVehicleOperations';
import { useAuth } from '@/hooks/useAuth';
import { Vehicle } from '@/components/vehicles/VehicleCard';
import { MobileLayout } from '@/components/layout/MobileLayout';

export default function VehiclesPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { vehicles, isLoading, error } = useVehicles();
  const { deleteVehicle } = useVehicleOperations();

  // Filter out archived vehicles for non-admin users
  const visibleVehicles = isAdmin 
    ? vehicles 
    : vehicles.filter(vehicle => vehicle.status !== 'Archived');

  const filteredVehicles = visibleVehicles.filter((vehicle) => 
    selectedStatus === 'all' || vehicle.status === selectedStatus
  );

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
  };

  const handleDelete = async (vehicleId: string) => {
    if (!isAdmin) return;
    
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle(vehicleId);
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">
          Loading vehicles...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
        Error loading vehicles: {error.message}
      </div>
    );
  }

  return (
    <MobileLayout
      header={{ title: 'Vehicles', showBackButton: false }}
      userRole={user?.role}
      currentPath="/vehicles"
    >
      <div className="space-y-4 pb-20">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 pb-4 pt-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Vehicles</h1>
            {isAdmin && (
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Vehicle</span>
              </Button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                selectedStatus === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatus('Available')}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                selectedStatus === 'Available'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              Available
            </button>
            <button
              onClick={() => setSelectedStatus('With Customer')}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                selectedStatus === 'With Customer'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              With Customer
            </button>
            <button
              onClick={() => setSelectedStatus('Prospecting')}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                selectedStatus === 'Prospecting'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              Prospecting
            </button>
            <button
              onClick={() => setSelectedStatus('Maintenance')}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                selectedStatus === 'Maintenance'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              Maintenance
            </button>
            <button
              onClick={() => setSelectedStatus('Unavailable')}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                selectedStatus === 'Unavailable'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              Unavailable
            </button>
            {isAdmin && (
              <button
                onClick={() => setSelectedStatus('Archived')}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                  selectedStatus === 'Archived'
                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
              >
                Archived
              </button>
            )}
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              No vehicles found
            </div>
          ) : (
            filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                {...vehicle}
                onEdit={isAdmin ? () => handleEdit(vehicle) : undefined}
                onDelete={isAdmin ? () => handleDelete(vehicle.id) : undefined}
              />
            ))
          )}
        </div>

        {/* Modals */}
        {isAdmin && (
          <>
            <AddVehicleModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSuccess={() => setIsAddModalOpen(false)}
            />

            <EditVehicleModal
              isOpen={!!editingVehicle}
              onClose={() => setEditingVehicle(null)}
              onSuccess={() => setEditingVehicle(null)}
              vehicle={editingVehicle}
            />
          </>
        )}
      </div>
    </MobileLayout>
  );
} 