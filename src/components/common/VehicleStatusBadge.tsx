import React from 'react';
import { StatusBadge } from './StatusBadge';
import type { VehicleStatus } from '@/types/Vehicle';

interface VehicleStatusBadgeProps {
  status: VehicleStatus;
  className?: string;
}

const statusMapping: Record<VehicleStatus, {
  type: 'success' | 'warning' | 'danger' | 'info' | 'default';
  label: string;
}> = {
  'Available': {
    type: 'success',
    label: 'Available'
  },
  'With Customer': {
    type: 'danger',
    label: 'With Customer'
  },
  'Maintenance': {
    type: 'warning',
    label: 'Maintenance'
  },
  'Prospecting': {
    type: 'warning',
    label: 'Prospecting'
  },
  'Archived': {
    type: 'default',
    label: 'Archived'
  },
  'Unavailable': {
    type: 'default',
    label: 'Unavailable'
  }
};

export const VehicleStatusBadge: React.FC<VehicleStatusBadgeProps> = ({ 
  status,
  className = ''
}) => {
  const { type, label } = statusMapping[status];
  
  return (
    <StatusBadge 
      status={type}
      className={className}
    >
      {label}
    </StatusBadge>
  );
}; 