import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, Car } from 'lucide-react';
import { Customer } from '@/types/customer';

interface CustomerVehiclesProps {
  customer: Customer;
  onAddVehicle: () => void;
}

export function CustomerVehicles({ customer, onAddVehicle }: CustomerVehiclesProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Assigned Vehicles
        </h3>
        <Button
          variant="accent"
          size="sm"
          onClick={onAddVehicle}
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {customer.assignedVehicles && customer.assignedVehicles.length > 0 ? (
        <div className="grid gap-4">
          {customer.assignedVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Car className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">{vehicle.make} {vehicle.model}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {vehicle.year} • {vehicle.vin}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {/* TODO: Implement view vehicle details */}}
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Car className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            No vehicles assigned to this customer yet.
          </p>
        </div>
      )}
    </div>
  );
} 