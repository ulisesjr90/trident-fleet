import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { getTypographyClass } from '@/lib/typography';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="form-group">
        {label && (
          <label
            htmlFor={props.id}
            className={getTypographyClass('body')}
          >
            {label}
          </label>
        )}
        <input
          className={cn(
            'block w-full h-10 px-3 py-2',
            'border border-gray-300 dark:border-gray-600 rounded-lg',
            'bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-white',
            'placeholder-gray-500 dark:placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-500 dark:border-red-400',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className={cn(getTypographyClass('body'), 'text-red-500 dark:text-red-400')}>
            {error}
          </p>
        )}
      </div>
    );
  }
); 