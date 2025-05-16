import { Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  assignedVehicles?: number;
}

interface CustomerCardProps {
  customer: Customer;
  onClick: () => void;
  onShare: () => void;
  onDelete: () => void;
}

export function CustomerCard({ customer, onClick, onShare, onDelete }: CustomerCardProps) {
  return (
    <div
      className="bg-white dark:bg-[#1f2937] rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{customer.name}</h3>
          {customer.email && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              {customer.email}
          </p>
          )}
          {customer.phone && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              {customer.phone}
            </p>
          )}
          </div>
        <div className="flex gap-2">
          <Button
            variant="accent"
            onClick={(e) => {
              e.stopPropagation();
              onShare();
            }}
            className="p-2"
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {customer.assignedVehicles !== undefined && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {customer.assignedVehicles} vehicle{customer.assignedVehicles !== 1 ? 's' : ''} assigned
        </div>
      )}
    </div>
  );
} 