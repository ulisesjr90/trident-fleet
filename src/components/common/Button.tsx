import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  const baseClasses = `
    inline-flex 
    items-center 
    justify-center 
    rounded-component 
    font-medium 
    focus:outline-none 
    focus:ring-2 
    focus:ring-offset-2
    transition-colors
    duration-300
  `;

  const variantClasses = {
    primary: `
      bg-trident-blue-500 
      text-white 
      hover:bg-trident-blue-600 
      focus:ring-trident-blue-400
    `,
    secondary: `
      bg-trident-yellow-500 
      text-gray-900 
      hover:bg-trident-yellow-600 
      focus:ring-trident-yellow-400
    `,
    danger: `
      bg-status-danger 
      text-white 
      hover:bg-status-danger/90 
      focus:ring-status-danger
    `,
    success: `
      bg-status-success 
      text-white 
      hover:bg-status-success/90 
      focus:ring-status-success
    `
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      {...props}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className || ''}
      `}
    >
      {children}
    </button>
  );
}; 