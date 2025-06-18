import React, { useState } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  variant = 'default',
  type,
  className,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const baseClasses = `
    w-full 
    px-3 py-2 
    border 
    rounded-component 
    focus:outline-none 
    focus:ring-2 
    text-gray-900 
    bg-white 
    placeholder-gray-500
  `;

  const variantClasses = {
    default: `
      border-gray-300 
      focus:ring-trident-blue-500 
      focus:border-transparent
    `,
    primary: `
      border-trident-blue-500 
      focus:ring-trident-blue-600
    `,
    secondary: `
      border-trident-yellow-500 
      focus:ring-trident-yellow-600
    `
  };

  const renderPasswordToggle = () => {
    if (type !== 'password') return null;

    return (
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <svg 
          onClick={() => setShowPassword(!showPassword)}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          className={`
            h-5 w-5 
            cursor-pointer 
            ${showPassword ? 'text-trident-blue-500' : 'text-gray-400'}
            hover:text-trident-blue-600
            transition-colors
            duration-200
          `}
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
        >
          {showPassword ? (
            // Eye open icon
            <>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </>
          ) : (
            // Eye closed icon
            <>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
            </>
          )}
        </svg>
      </div>
    );
  };

  return (
    <div className="relative">
      {label && (
        <label 
          htmlFor={props.id} 
          className="
            block 
            text-sm 
            font-medium 
            text-gray-700
            mb-1
          "
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          type={type === 'password' && showPassword ? 'text' : type}
          className={`
            ${baseClasses}
            ${variantClasses[variant]}
            ${className || ''}
            ${error ? 'border-status-danger focus:ring-status-danger' : ''}
            ${type === 'password' ? 'pr-10' : ''}
          `}
        />
        {renderPasswordToggle()}
      </div>
      {error && (
        <p className="
          mt-1 
          text-xs 
          text-status-danger
        ">
          {error}
        </p>
      )}
    </div>
  );
}; 