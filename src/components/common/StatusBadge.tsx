import React from 'react';

export type StatusBadgeProps = {
  status: 'success' | 'warning' | 'danger' | 'info' | 'default';
  children: React.ReactNode;
  className?: string;
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status = 'default', 
  children, 
  className = '' 
}) => {
  const statusClasses = {
    success: 'bg-status-success-light text-status-success',
    warning: 'bg-status-warning-light text-status-warning',
    danger: 'bg-status-danger-light text-status-danger',
    info: 'bg-status-info-light text-status-info',
    default: 'bg-gray-100 text-gray-700'
  };

  return (
    <span 
      className={`
        inline-block 
        px-2 
        py-1 
        rounded-badge 
        text-xs 
        font-medium 
        ${statusClasses[status]} 
        ${className}
      `}
    >
      {children}
    </span>
  );
}; 