import React, { useState } from 'react';
import type { VehicleStatus } from '@/types/Vehicle';
import { Button } from '@/components/common/Button';
import { VehicleStatusBadge } from '@/components/common/VehicleStatusBadge';

export interface VehicleFilters {
  showUnavailable: boolean;
  showArchived: boolean;
  statuses: VehicleStatus[];
  sortBy: 'vehicleDescriptor' | 'currentMileage' | 'registrationExpiration' | 'status' | 'source' | 'type';
  sortDirection: 'asc' | 'desc';
}

interface VehicleFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: VehicleFilters;
  onApplyFilters: (filters: VehicleFilters) => void;
}

const defaultFilters: VehicleFilters = {
  showUnavailable: false,
  showArchived: false,
  statuses: ['Available', 'With Customer', 'Maintenance', 'Prospecting'],
  sortBy: 'vehicleDescriptor',
  sortDirection: 'asc'
};

export const VehicleFilterModal: React.FC<VehicleFilterModalProps> = ({
  isOpen,
  onClose,
  filters: initialFilters,
  onApplyFilters
}) => {
  const [filters, setFilters] = useState<VehicleFilters>(initialFilters);

  const handleStatusToggle = (status: VehicleStatus) => {
    setFilters(prev => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter(s => s !== status)
        : [...prev.statuses, status]
    }));
  };

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Filter & Sort Vehicles</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Status Filters */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Status</h3>
            <div className="space-y-2">
              {(['Available', 'With Customer', 'Maintenance', 'Prospecting', 'Unavailable', 'Archived'] as VehicleStatus[]).map(status => (
                <label key={status} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={filters.statuses.includes(status)}
                    onChange={() => handleStatusToggle(status)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <span className="flex items-center space-x-2">
                    <VehicleStatusBadge status={status} />
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                sortBy: e.target.value as VehicleFilters['sortBy']
              }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="vehicleDescriptor">Vehicle Name</option>
              <option value="type">Vehicle Type</option>
              <option value="source">Source</option>
              <option value="currentMileage">Current Mileage</option>
              <option value="registrationExpiration">Registration Expiration</option>
              <option value="status">Status</option>
            </select>

            <div className="mt-3 flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={filters.sortDirection === 'asc'}
                  onChange={() => setFilters(prev => ({ ...prev, sortDirection: 'asc' }))}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700">Ascending</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={filters.sortDirection === 'desc'}
                  onChange={() => setFilters(prev => ({ ...prev, sortDirection: 'desc' }))}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700">Descending</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="primary" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}; 