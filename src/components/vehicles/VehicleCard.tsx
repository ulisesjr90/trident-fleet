import { Car, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { Vehicle, VehicleStatus } from '@/types/vehicle';

export interface VehicleCardProps extends Vehicle {
  onEdit?: () => void;
  onDelete?: () => void;
}

const statusColors = {
  'Available': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'With Customer': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'Prospecting': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'Maintenance': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'Unavailable': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'Archived': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const statusLabels = {
  'Available': 'Available',
  'With Customer': 'With Customer',
  'Prospecting': 'Prospecting',
  'Maintenance': 'Maintenance',
  'Unavailable': 'Unavailable',
  'Archived': 'Archived',
};

export function VehicleCard({
  id,
  vehicleDescriptor,
  status,
  currentMileage,
  nextOilChangeDueMileage,
  color,
  source,
  onEdit,
  onDelete,
}: VehicleCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === 'admin';

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on edit or delete buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    router.push(`/vehicles/${id}`);
  };

  return (
    <div 
      className="bg-white dark:bg-[#1f2937] rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <Car className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </div>
          <div>
            <h3 className="font-semibold text-lg">{vehicleDescriptor}</h3>
            <div className="flex items-center gap-2">
              <Badge className={statusColors[status]}>
              {statusLabels[status]}
              </Badge>
              {source && (
                <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {source}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="p-2"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
          {isAdmin && onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Current Mileage</span>
          <span>{currentMileage.toLocaleString()} miles</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Next Oil Change</span>
          <span>{nextOilChangeDueMileage.toLocaleString()} miles</span>
        </div>
        {color && (
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Color</span>
            <span>{color}</span>
          </div>
        )}
      </div>
    </div>
  );
} 