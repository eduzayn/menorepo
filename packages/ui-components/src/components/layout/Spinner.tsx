import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const spinnerVariants = cva(
  'animate-spin rounded-full border-b-2 border-current border-t-transparent',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        default: 'h-8 w-8',
        lg: 'h-12 w-12',
      },
      color: {
        default: 'border-blue-600',
        primary: 'border-blue-600',
        secondary: 'border-gray-600',
        success: 'border-green-600',
        warning: 'border-yellow-600',
        danger: 'border-red-600',
      },
    },
    defaultVariants: {
      size: 'default',
      color: 'default',
    },
  }
);

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export function Spinner({ className, size, color }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className={cn(spinnerVariants({ size, color, className }))}
    />
  );
} 