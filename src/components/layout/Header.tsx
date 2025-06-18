import { type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import InlineEdit from '@/components/common/InlineEdit';
import { useAuth } from '@/contexts/AuthContext';
import { vehicleService } from '@/services/vehicleService';
import { useState, useEffect } from 'react';
import type { Vehicle } from '@/types/Vehicle';
import { UserRole } from '@/types/user';

interface HeaderProps {
  children?: ReactNode;
}

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/dashboard':
      return 'Dashboard';
    case '/vehicles':
      return 'Vehicles';
    case '/customers':
      return 'Customers';
    case '/users':
      return 'Users';
    case '/settings':
      return 'Settings';
    default:
      if (pathname.startsWith('/vehicles/')) {
        return 'Vehicle Details';
      }
      return '';
  }
};

export default function Header({ children }: HeaderProps) {
  const location = useLocation();
  const { role } = useAuth();
  const isAdmin = role === UserRole.ADMIN;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const pageTitle = getPageTitle(location.pathname);
  const isVehicleDetails = location.pathname.startsWith('/vehicles/');

  useEffect(() => {
    const fetchVehicle = async () => {
      if (isVehicleDetails) {
        const parts = location.pathname.split('/');
        const maybeVehicleId = parts[2];
        if (parts.length >= 3 && typeof maybeVehicleId === 'string' && maybeVehicleId.length > 0) {
          try {
            const vehicle = await vehicleService.getVehicleById(maybeVehicleId);
            setVehicle(vehicle);
          } catch (error) {
            console.error('Failed to fetch vehicle:', error);
          }
        }
      }
    };

    fetchVehicle();
  }, [location.pathname, isVehicleDetails]);

  const handleVehicleNameUpdate = async (value: string) => {
    if (!vehicle) return;
    await vehicleService.updateVehicle(vehicle.id, { vehicleDescriptor: value });
    setVehicle({ ...vehicle, vehicleDescriptor: value });
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="h-20 md:h-20 px-4 md:px-6 py-2 md:py-2 flex items-center">
        <div className="flex items-center flex-1">
          <img 
            src="/logo.png" 
            alt="Trident Fleet Logo" 
            className="h-16 md:h-16 w-auto"
          />
          {pageTitle && (
            <h1 className="text-2xl font-semibold text-gray-900 ml-6 md:ml-8">
              {pageTitle}
            </h1>
          )}
        </div>
      </div>
      {children}
    </header>
  );
} 