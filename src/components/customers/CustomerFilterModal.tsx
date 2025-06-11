import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getTypographyClass } from '@/lib/typography';

type SortField = 'name' | 'email' | 'createdAt';
type SortDirection = 'asc' | 'desc';
type FilterField = 'vehicleCount';

interface CustomerFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  sortField: SortField;
  sortDirection: SortDirection;
  filters: {
    vehicleCount?: 'with' | 'without';
  };
  onSort: (field: SortField) => void;
  onFilterChange: (field: FilterField, value: 'with' | 'without' | undefined) => void;
  onReset: () => void;
}

const SortIcon = ({ field, currentField, direction }: { field: SortField; currentField: SortField; direction: SortDirection }) => {
  if (field !== currentField) return null;
  return direction === 'asc' ? (
    <ChevronUp className="h-4 w-4 ml-1" />
  ) : (
    <ChevronDown className="h-4 w-4 ml-1" />
  );
};

export function CustomerFilterModal({
  isOpen,
  onClose,
  sortField,
  sortDirection,
  filters,
  onSort,
  onFilterChange,
  onReset,
}: CustomerFilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className={getTypographyClass('header')}>Filter Customers</h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Filter Section */}
        <div className="mb-6">
          <h3 className={getTypographyClass('body')}>Filter By</h3>
          <div className="space-y-4 mt-2">
            {/* Vehicle Count Filter */}
            <div>
              <label className={getTypographyClass('body')}>Vehicles</label>
              <div className="flex gap-2 mt-1">
                <Button
                  variant={filters.vehicleCount === 'with' ? 'default' : 'outline'}
                  onClick={() => onFilterChange('vehicleCount', filters.vehicleCount === 'with' ? undefined : 'with')}
                  className="flex-1"
                >
                  <span className={getTypographyClass('body')}>With Vehicles</span>
                </Button>
                <Button
                  variant={filters.vehicleCount === 'without' ? 'default' : 'outline'}
                  onClick={() => onFilterChange('vehicleCount', filters.vehicleCount === 'without' ? undefined : 'without')}
                  className="flex-1"
                >
                  <span className={getTypographyClass('body')}>Without Vehicles</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sort Section */}
        <div className="mb-6">
          <h3 className={getTypographyClass('body')}>Sort By</h3>
          <div className="space-y-2 mt-2">
            {(['name', 'email', 'createdAt'] as const).map((field) => (
              <Button
                key={field}
                variant={sortField === field ? 'default' : 'outline'}
                onClick={() => onSort(field)}
                className="w-full justify-between"
              >
                <span className={getTypographyClass('body')}>
                  {field === 'createdAt' ? 'Created' :
                   field.charAt(0).toUpperCase() + field.slice(1)}
                </span>
                <SortIcon field={field} currentField={sortField} direction={sortDirection} />
              </Button>
            ))}
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={onReset}
          >
            <span className={getTypographyClass('body')}>Reset</span>
          </Button>
          <Button
            onClick={onClose}
          >
            <span className={getTypographyClass('body')}>Apply</span>
          </Button>
        </div>
      </div>
    </div>
  );
} 