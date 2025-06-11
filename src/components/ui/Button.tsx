import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'danger' | 'default' | 'outline' | 'ghost' | 'link';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    isLoading = false,
    icon,
    iconPosition = 'left',
    children,
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary",
      accent: "bg-accent text-white hover:bg-accent/90 focus-visible:ring-accent",
      danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
      default: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
      outline: "border border-gray-300 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500 dark:border-gray-600 dark:hover:bg-gray-800",
      ghost: "bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500 dark:hover:bg-gray-800",
      link: "bg-transparent text-primary underline-offset-4 hover:underline focus-visible:ring-primary",
    };

    const sizeStyles = "h-10 px-4 text-base";

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizeStyles,
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        {!isLoading && icon && iconPosition === 'left' && (
          <span className="h-4 w-4">{icon}</span>
        )}
        {children}
        {!isLoading && icon && iconPosition === 'right' && (
          <span className="h-4 w-4">{icon}</span>
        )}
      </button>
    );
  }
); 

Button.displayName = 'Button';

export { Button }; 