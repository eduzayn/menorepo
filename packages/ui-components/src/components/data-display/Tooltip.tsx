import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';

const tooltipVariants = cva(
  'z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  {
    variants: {
      variant: {
        default: 'bg-gray-900 text-white',
        primary: 'bg-blue-600 text-white',
        secondary: 'bg-gray-800 text-white',
        success: 'bg-green-600 text-white',
        warning: 'bg-yellow-600 text-white',
        danger: 'bg-red-600 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface TooltipProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tooltipVariants> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  content: string;
  children: React.ReactNode;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, variant, content, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className="group relative inline-block"
        {...props}
      >
        {children}
        <div
          className={cn(
            'absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100',
            tooltipVariants({ variant, className })
          )}
          role="tooltip"
        >
          {content}
        </div>
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export { Tooltip, tooltipVariants }; 