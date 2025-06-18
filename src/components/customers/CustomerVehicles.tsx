import { useState } from 'react';
import { Vehicle } from '@/types/vehicle';
import { Button } from '@/components/ui/Button';
import { getTypographyClass } from '@/lib/typography';

interface CustomerVehiclesProps {
  vehicles: Vehicle[];
  onAddVehicle: () => void;
  onEditVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (vehicle: Vehicle) => void;
}

export function CustomerVehicles({
  vehicles,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle,
}: CustomerVehiclesProps) {
  const [expandedVehicle, setExpandedVehicle] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={getTypographyClass('header')}>Vehicles</h3>
        <Button onClick={onAddVehicle}>Add Vehicle</Button>
      </div>

      <div className="space-y-2">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={getTypographyClass('header')}>{vehicle.vehicleDescriptor}</p>
                <p className={getTypographyClass('body')}>
                  {vehicle.vin ? `VIN: ${vehicle.vin}` : ''}
                  {vehicle.licensePlate ? ` • Plate: ${vehicle.licensePlate}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => onEditVehicle(vehicle)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onDeleteVehicle(vehicle)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 