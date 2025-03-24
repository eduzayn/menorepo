import { cn } from '../utils';

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600',
        className
      )}
    />
  );
} 