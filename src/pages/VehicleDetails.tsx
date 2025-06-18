import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { vehicleService } from '@/services/vehicleService';
import type { Vehicle } from '@/types/Vehicle';
import { ArrowLeft } from 'lucide-react';
import InlineEdit from '@/components/common/InlineEdit';
import { useAuth } from '@/contexts/AuthContext';
import { VehicleStatusBadge } from '@/components/common/VehicleStatusBadge';

export default function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Force isAdmin to true for testing
  const isAdmin = true; // user?.role === 'admin';

  useEffect(() => {
    const loadVehicle = async () => {
      if (!id) return;
      try {
        const data = await vehicleService.getVehicleById(id);
        setVehicle(data);
      } catch (error) {
        console.error('Error loading vehicle:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  const updateField = async (field: keyof Vehicle, value: any) => {
    if (!id || !vehicle) return;
    try {
      console.log('Updating field:', field, 'with value:', value); // Debug log
      await vehicleService.updateVehicle(id, { [field]: value });
      setVehicle(prev => prev ? { ...prev, [field]: value } : null);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw new Error('Failed to update');
    }
  };

  const getVehicleDisplayName = (vehicle: Vehicle) => {
    if (!vehicle.color) return vehicle.vehicleDescriptor;
    return `${vehicle.vehicleDescriptor} (${vehicle.color})`;
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!vehicle) {
    return <div>Vehicle not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate('/vehicles')}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="text-2xl font-semibold text-gray-900">
          {getVehicleDisplayName(vehicle)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Vehicle Information</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Vehicle Name</dt>
                <dd className="mt-1">
                  <InlineEdit
                    value={vehicle.vehicleDescriptor}
                    onSave={value => updateField('vehicleDescriptor', value)}
                    isEditable={isAdmin}
                  />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Color</dt>
                <dd className="mt-1">
                  <InlineEdit
                    value={vehicle.color}
                    onSave={value => updateField('color', value)}
                    isEditable={isAdmin}
                  />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1">
                  {isAdmin ? (
                    <select
                      value={vehicle.type || ''}
                      onChange={e => updateField('type', e.target.value || undefined)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Select a type...</option>
                      <option value="Sedan">Sedan</option>
                      <option value="Coupe">Coupe</option>
                      <option value="SUV">SUV</option>
                      <option value="Crossover">Crossover</option>
                      <option value="Pickup">Pickup</option>
                    </select>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {vehicle.type || 'Not specified'}
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Source</dt>
                <dd className="mt-1">
                  <InlineEdit
                    value={vehicle.source}
                    onSave={value => updateField('source', value)}
                    isEditable={isAdmin}
                  />
                </dd>
              </div>
              {vehicle.source === 'Avis' && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">MVA Number</dt>
                  <dd className="mt-1">
                    <InlineEdit
                      value={vehicle.mvaNumber || ''}
                      onSave={value => updateField('mvaNumber', value)}
                      isEditable={isAdmin}
                    />
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">VIN</dt>
                <dd className="mt-1">
                  <InlineEdit
                    value={vehicle.vin || ''}
                    onSave={value => updateField('vin', value)}
                    isEditable={isAdmin}
                  />
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Status & Mileage</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  {isAdmin ? (
                    <select
                      value={vehicle.status}
                      onChange={e => updateField('status', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="Available">Available</option>
                      <option value="With Customer">With Customer</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Prospecting">Prospecting</option>
                      <option value="Archived">Archived</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
                  ) : (
                    <VehicleStatusBadge status={vehicle.status} />
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Current Mileage</dt>
                <dd className="mt-1">
                  <InlineEdit
                    value={vehicle.currentMileage}
                    onSave={value => updateField('currentMileage', Number(value))}
                    type="number"
                    isEditable={isAdmin}
                  />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Next Oil Change Due</dt>
                <dd className="mt-1">
                  <InlineEdit
                    value={vehicle.nextOilChangeDueMileage}
                    onSave={value => updateField('nextOilChangeDueMileage', Number(value))}
                    type="number"
                    isEditable={isAdmin}
                  />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Miles Until Service</dt>
                <dd className="mt-1 text-gray-900">
                  {(vehicle.nextOilChangeDueMileage - vehicle.currentMileage).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Registration Details</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">License Plate</dt>
              <dd className="mt-1">
                <InlineEdit
                  value={vehicle.licensePlate || ''}
                  onSave={value => updateField('licensePlate', value)}
                  isEditable={isAdmin}
                />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">State</dt>
              <dd className="mt-1">
                <InlineEdit
                  value={vehicle.state || ''}
                  onSave={value => updateField('state', value)}
                  isEditable={isAdmin}
                />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Registration Expiration</dt>
              <dd className="mt-1">
                <InlineEdit
                  value={vehicle.registrationExpiration || ''}
                  onSave={value => updateField('registrationExpiration', value)}
                  type="date"
                  isEditable={isAdmin}
                />
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <InlineEdit
                value={vehicle.notes || ''}
                onSave={value => updateField('notes', value)}
                type="textarea"
                isEditable={isAdmin}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 