import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getTypographyClass } from '@/lib/typography';
import { Vehicle, VehicleStatus } from '@/types/vehicle';

interface VehicleCardProps extends Vehicle {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function VehicleCard({
  id,
  vehicleDescriptor,
  licensePlate,
  status,
  onEdit,
  onDelete,
}: VehicleCardProps) {
  const router = useRouter();

  const statusStyles = {
    [VehicleStatus.Available]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    [VehicleStatus.WithCustomer]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    [VehicleStatus.Prospecting]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    [VehicleStatus.Maintenance]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    [VehicleStatus.Unavailable]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    [VehicleStatus.Archived]: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div 
          className="flex-1 cursor-pointer"
          onClick={() => router.push(`/vehicles/${id}`)}
        >
          <h3 className={getTypographyClass('header')}>
            {vehicleDescriptor}
          </h3>
          {licensePlate && (
            <p className={getTypographyClass('body')}>
              {licensePlate}
            </p>
          )}
        </div>
            <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
            {status}
          </span>
          {onEdit && (
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 