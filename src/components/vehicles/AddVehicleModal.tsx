import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { VehicleStatus } from '@/types/vehicle';
import { useVehicleOperations } from '@/hooks/useVehicleOperations';
import { getTypographyClass } from '@/lib/typography';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddVehicleModal({ isOpen, onClose, onSuccess }: AddVehicleModalProps) {
  const SOURCE_OPTIONS = {
    JAY: 'Jay',
    AVIS: 'Avis',
  } as const;

  type SourceType = typeof SOURCE_OPTIONS[keyof typeof SOURCE_OPTIONS];

  // Form state
  const [vehicleDescriptor, setVehicleDescriptor] = useState('');
  const [color, setColor] = useState('');
  const [source, setSource] = useState<SourceType | ''>('');
  const [mvaNumber, setMvaNumber] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [initialMileage, setInitialMileage] = useState('');
  const [vin, setVin] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [state, setState] = useState('');
  const [registrationExpiration, setRegistrationExpiration] = useState('');
  const [notes, setNotes] = useState('');
  const [useDefaultOilChange, setUseDefaultOilChange] = useState(true);
  const [customOilChangeMileage, setCustomOilChangeMileage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const { addVehicle, isLoading, error } = useVehicleOperations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const mileage = parseInt(initialMileage, 10) || 0;
    const nextOilChangeMileage = useDefaultOilChange 
      ? mileage + 5000 
      : parseInt(customOilChangeMileage, 10);

    if (!source) {
      setFormError('Please select a source');
      return;
    }

    try {
      await addVehicle({
        vehicleDescriptor,
        source,
        currentMileage: mileage,
        nextOilChangeDueMileage: nextOilChangeMileage,
        color: color || null,
        vin: vin || null,
        licensePlate: licensePlate || null,
        state: state || null,
        registrationExpiration: registrationExpiration ? new Date(registrationExpiration) : null,
        notes: notes || null,
        mvaNumber: source === SOURCE_OPTIONS.AVIS ? mvaNumber || null : null,
        returnDate: source === SOURCE_OPTIONS.AVIS && returnDate ? new Date(returnDate) : null,
        status: VehicleStatus.Available,
        isArchived: false,
      });

      // Reset form
      setVehicleDescriptor('');
      setColor('');
      setSource('');
      setMvaNumber('');
      setReturnDate('');
      setInitialMileage('');
      setVin('');
      setLicensePlate('');
      setState('');
      setRegistrationExpiration('');
      setNotes('');
      setUseDefaultOilChange(true);
      setCustomOilChangeMileage('');
      setFormError(null);

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error adding vehicle:', err);
      setFormError('Failed to add vehicle. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-16">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[calc(100vh-12rem)] overflow-y-auto mb-16">
        <div className="flex items-center justify-between p-3 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className={getTypographyClass('header')}>Add New Vehicle</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-3 space-y-6">
          {(error || formError) && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-2 rounded-md">
              <p className={getTypographyClass('body')}>
              {formError || error?.message}
              </p>
            </div>
          )}

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className={getTypographyClass('header')}>Basic Information</h3>
              
              <div>
                <Input
                  id="vehicleDescriptor"
                  value={vehicleDescriptor}
                  onChange={(e) => setVehicleDescriptor(e.target.value)}
                  placeholder="Vehicle Descriptor *"
                  required
                />
              </div>

              <div>
                <Input
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Color"
                />
              </div>

              <div>
                <div className="relative">
                  <select
                    id="source"
                    value={source}
                    onChange={(e) => setSource(e.target.value as SourceType | '')}
                    className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    aria-label="Select vehicle source"
                  >
                    <option value="" className="text-gray-500">Select Source</option>
                    {Object.values(SOURCE_OPTIONS).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {source === SOURCE_OPTIONS.AVIS && (
                <div className="space-y-4">
                  <div>
                    <Input
                      id="mvaNumber"
                      value={mvaNumber}
                      onChange={(e) => setMvaNumber(e.target.value)}
                      placeholder="MVA Number"
                    />
                  </div>
                  <div>
                    <label htmlFor="returnDate" className={getTypographyClass('body')}>
                      Return Date
                    </label>
                    <div className="relative">
                      <Input
                        id="returnDate"
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        placeholder="Return Date"
                        className="[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:dark:invert"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle Details */}
            <div className="space-y-4">
              <h3 className={getTypographyClass('header')}>Vehicle Details</h3>
              
              <div>
                <Input
                  id="initialMileage"
                  type="number"
                  value={initialMileage}
                  onChange={(e) => setInitialMileage(e.target.value)}
                  placeholder="Initial Mileage"
                />
              </div>

              <div>
                <Input
                  id="vin"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  placeholder="VIN"
                />
              </div>

              <div>
                <Input
                  id="licensePlate"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  placeholder="License Plate"
                />
              </div>

              <div>
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                />
              </div>

              <div>
                <label htmlFor="registrationExpiration" className={getTypographyClass('body')}>
                  Registration Expiration
                </label>
                <div className="relative">
                  <Input
                    id="registrationExpiration"
                    type="date"
                    value={registrationExpiration}
                    onChange={(e) => setRegistrationExpiration(e.target.value)}
                    placeholder="Registration Expiration Date"
                    className="[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:dark:invert"
                  />
              </div>
            </div>
          </div>

            {/* Maintenance Settings */}
            <div className="space-y-4">
              <h3 className={getTypographyClass('header')}>Maintenance Settings</h3>
            
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="useDefaultOilChange"
                checked={useDefaultOilChange}
                onChange={(e) => setUseDefaultOilChange(e.target.checked)}
                    className="mt-1 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
              />
                  <label htmlFor="useDefaultOilChange" className={getTypographyClass('body')}>
                    Use default oil change interval (5,000 miles)
              </label>
            </div>

            {!useDefaultOilChange && (
                  <div className="pl-7">
                <Input
                  id="customOilChangeMileage"
                  type="number"
                  value={customOilChangeMileage}
                  onChange={(e) => setCustomOilChangeMileage(e.target.value)}
                      placeholder="Custom Oil Change Interval (miles)"
                />
              </div>
            )}
          </div>

          <div>
                <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional Notes"
            />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Vehicle'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 