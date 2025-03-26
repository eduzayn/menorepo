import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';

const chipVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-gray-200 bg-white text-gray-800 hover:bg-gray-100',
        primary: 'border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100',
        secondary: 'border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100',
        success: 'border-green-200 bg-green-50 text-green-800 hover:bg-green-100',
        warning: 'border-yellow-200 bg-yellow-50 text-yellow-800 hover:bg-yellow-100',
        danger: 'border-red-200 bg-red-50 text-red-800 hover:bg-red-100',
        outline: 'border-gray-200 bg-white text-gray-800 hover:bg-gray-100',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        default: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1',
      },
      interactive: {
        true: 'cursor-pointer',
        false: 'cursor-default',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      interactive: false,
    },
  }
);

export interface ChipProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  interactive?: boolean;
  onDelete?: () => void;
}

const Chip = forwardRef<HTMLDivElement, ChipProps>(
  ({ className, variant, size, interactive, onDelete, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(chipVariants({ variant, size, interactive, className }))}
        {...props}
      >
        {children}
        {onDelete && (
          <button
            type="button"
            className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
            onClick={onDelete}
            aria-label="Remover"
          >
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Chip.displayName = 'Chip';

export { Chip, chipVariants }; 