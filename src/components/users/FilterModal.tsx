import { Button } from '@/components/ui/Button';
import { X, ChevronUp, ChevronDown } from 'lucide-react';

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
}

export function FilterModal({ open, onClose }: FilterModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Filter Users</h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Sort Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Sort By</h3>
          <div className="space-y-2">
            {(['displayName', 'email', 'role', 'status', 'invitedAt'] as const).map((field) => (
              <Button
                key={field}
                variant="outline"
                className="w-full justify-between"
              >
                <span className="text-sm">
                  {field === 'displayName' ? 'Name' :
                   field === 'invitedAt' ? 'Invited' :
                   field.charAt(0).toUpperCase() + field.slice(1)}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
          >
            <span className="text-sm">Reset</span>
          </Button>
          <Button onClick={onClose}>
            <span className="text-sm">Apply</span>
          </Button>
        </div>
      </div>
    </div>
  );
} 