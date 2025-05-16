import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'danger' | 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background';
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary/90 active:bg-primary/80 focus:ring-primary/50 shadow-sm',
      accent: 'bg-accent text-white hover:bg-accent/90 active:bg-accent/80 focus:ring-accent/50 shadow-sm',
      danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-500/50 shadow-sm',
      default: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-500/50 shadow-sm dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600',
      outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-500/50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:active:bg-gray-700',
    };
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-opacity-100',
          'touch-manipulation',
          className
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
); 