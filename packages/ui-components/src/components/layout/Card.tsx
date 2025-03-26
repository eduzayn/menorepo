import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const cardVariants = cva(
  'rounded-lg border bg-white text-gray-950 shadow-sm transition-all duration-200 ease-in-out',
  {
    variants: {
      variant: {
        default: 'border-gray-200 hover:shadow-md',
        elevated: 'border-gray-200 shadow-md hover:shadow-lg',
        bordered: 'border-gray-300 hover:border-gray-400',
        ghost: 'border-transparent hover:bg-gray-50',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

export interface CardProps 
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  className?: string;
  variant?: 'default' | 'elevated' | 'bordered' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="article"
        className={cn(cardVariants({ variant, padding, className }))}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export { Card, cardVariants }; 