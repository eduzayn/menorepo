import * as React from "react";
import { cn } from "../../utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center border rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variant === "default" && "bg-primary border-transparent text-primary-foreground hover:bg-primary/80",
        variant === "secondary" && "bg-secondary border-transparent text-secondary-foreground hover:bg-secondary/80",
        variant === "destructive" && "bg-destructive border-transparent text-destructive-foreground hover:bg-destructive/80",
        variant === "outline" && "text-foreground",
        className
      )}
      {...props}
    />
  );
}

export { Badge }; 