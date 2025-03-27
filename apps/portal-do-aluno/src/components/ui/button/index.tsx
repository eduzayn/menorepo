/**
 * Componente Button - simples implementação para o Portal de Negociações
 */

import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    // Mapas de classes simplificados para variantes e tamanhos
    const variantClasses = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      outline: "border border-gray-300 hover:bg-gray-100",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
      ghost: "hover:bg-gray-100",
      link: "underline text-blue-600 hover:text-blue-800"
    };
    
    const sizeClasses = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 text-sm",
      lg: "h-11 px-8 text-lg",
      icon: "h-10 w-10"
    };
    
    return (
      <button
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 
          disabled:opacity-50 disabled:pointer-events-none 
          ${variantClasses[variant]} ${sizeClasses[size]} ${className || ""}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button }; 