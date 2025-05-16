import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useVehicleOperations } from '@/hooks/useVehicleOperations';
import { Vehicle } from './VehicleCard';

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vehicle: Vehicle | null;
}

export function EditVehicleModal({
  isOpen,
  onClose,
  onSuccess,
  vehicle,
}: EditVehicleModalProps) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<Vehicle['status']>('available');
  const [mileage, setMileage] = useState('');
  const [lastServiceDate, setLastServiceDate] = useState('');

  const { updateVehicle, isLoading, error } = useVehicleOperations();

  useEffect(() => {
    if (vehicle) {
      setName(vehicle.name);
      setStatus(vehicle.status);
      setMileage(vehicle.mileage.toString());
      setLastServiceDate(vehicle.lastServiceDate || '');
    }
  }, [vehicle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;

    try {
      await updateVehicle(vehicle.id, {
        name,
        status,
        mileage: parseInt(mileage, 10),
        lastServiceDate: lastServiceDate || undefined,
      });
      onSuccess();
    } catch (error) {
      console.error('Error updating vehicle:', error);
    }
  };

  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Vehicle</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Vehicle Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Vehicle['status'])}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
            >
              <option value="available">Available</option>
              <option value="in_use">In Use</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          <div>
            <label htmlFor="mileage" className="block text-sm font-medium mb-1">
              Mileage
            </label>
            <Input
              id="mileage"
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="lastServiceDate" className="block text-sm font-medium mb-1">
              Last Service Date
            </label>
            <Input
              id="lastServiceDate"
              type="date"
              value={lastServiceDate}
              onChange={(e) => setLastServiceDate(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm">
              {error.message}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 