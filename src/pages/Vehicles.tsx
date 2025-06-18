import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { vehicleService } from '@/services/vehicleService';
import type { Vehicle } from '@/types/Vehicle';
import { format } from 'date-fns';
import { VehicleStatusBadge } from '@/components/common/VehicleStatusBadge';
import { VehicleFilterModal, type VehicleFilters } from '@/components/modals/VehicleFilterModal';
import { SlidersHorizontal } from 'lucide-react';

const defaultFilters: VehicleFilters = {
  showUnavailable: false,
  showArchived: false,
  statuses: ['Available', 'With Customer', 'Maintenance', 'Prospecting'],
  sortBy: 'vehicleDescriptor',
  sortDirection: 'asc'
};

export default function Vehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<VehicleFilters>(defaultFilters);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const fetchedVehicles = await vehicleService.getAllVehicles();
        setVehicles(fetchedVehicles);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load vehicles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const filteredAndSortedVehicles = useMemo(() => {
    return vehicles
      // Apply status filters
      .filter(vehicle => filters.statuses.includes(vehicle.status))
      // Apply sorting
      .sort((a, b) => {
        const sortField = filters.sortBy;
        const direction = filters.sortDirection === 'asc' ? 1 : -1;

        if (sortField === 'vehicleDescriptor') {
          return direction * a.vehicleDescriptor.localeCompare(b.vehicleDescriptor);
        }
        if (sortField === 'source') {
          return direction * a.source.localeCompare(b.source);
        }
        if (sortField === 'type') {
          const aType = a.type || '';
          const bType = b.type || '';
          return direction * aType.localeCompare(bType);
        }
        if (sortField === 'currentMileage') {
          return direction * (a.currentMileage - b.currentMileage);
        }
        if (sortField === 'registrationExpiration') {
          const aDate = a.registrationExpiration ? new Date(a.registrationExpiration).getTime() : 0;
          const bDate = b.registrationExpiration ? new Date(b.registrationExpiration).getTime() : 0;
          return direction * (aDate - bDate);
        }
        if (sortField === 'status') {
          return direction * a.status.localeCompare(b.status);
        }
        return 0;
      });
  }, [vehicles, filters]);

  // Check if any vehicles are from Avis
  const hasAvisVehicles = useMemo(() => {
    return vehicles.some(vehicle => vehicle.source === 'Avis');
  }, [vehicles]);

  const getVehicleDisplayName = (vehicle: Vehicle) => {
    if (!vehicle.color) return vehicle.vehicleDescriptor;
    return `${vehicle.vehicleDescriptor} (${vehicle.color})`;
  };

  const columns = [
    {
      header: 'Vehicle',
      accessor: (vehicle: Vehicle) => (
        <div>
          <div className="font-medium text-gray-900">{getVehicleDisplayName(vehicle)}</div>
          <div className="text-sm text-gray-500">{vehicle.vin || 'No VIN'}</div>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: (vehicle: Vehicle) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {vehicle.type || 'Not specified'}
        </span>
      ),
    },
    {
      header: 'Source',
      accessor: (vehicle: Vehicle) => vehicle.source,
    },
    {
      header: 'Mileage',
      accessor: (vehicle: Vehicle) => (
        <div>
          <div>Current: {vehicle.currentMileage.toLocaleString()}</div>
          <div className="text-sm text-gray-500">
            Next Oil: {vehicle.nextOilChangeDueMileage.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      header: 'Registration',
      accessor: (vehicle: Vehicle) => (
        <div>
          <div>{vehicle.licensePlate || 'No Plate'}</div>
          <div className="text-sm text-gray-500">
            {vehicle.state ? `${vehicle.state}${vehicle.registrationExpiration ? ` - Exp: ${vehicle.registrationExpiration}` : ''}` : 'No State'}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (vehicle: Vehicle) => (
        <VehicleStatusBadge status={vehicle.status} />
      ),
    },
    ...(hasAvisVehicles ? [{
      header: 'MVA',
      accessor: (vehicle: Vehicle) => vehicle.source === 'Avis' ? (vehicle.mvaNumber || 'N/A') : '-',
    }] : []),
  ];

  const handleApplyFilters = (newFilters: VehicleFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="secondary"
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filter & Sort</span>
        </Button>
        <Button variant="primary">Add Vehicle</Button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm">
        <DataTable
          columns={columns}
          data={filteredAndSortedVehicles}
          emptyMessage="No vehicles found"
          isLoading={isLoading}
          onRowClick={(vehicle) => navigate(`/vehicles/${vehicle.id}`)}
        />
      </div>

      <VehicleFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
} 