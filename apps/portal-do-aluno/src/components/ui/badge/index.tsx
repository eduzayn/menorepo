/**
 * Componente Badge - simples implementação para o Portal de Negociações
 */

import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantClasses = {
    default: "bg-blue-600 text-white border-transparent",
    secondary: "bg-gray-200 text-gray-800 border-transparent",
    destructive: "bg-red-600 text-white border-transparent",
    outline: "border-gray-300 text-gray-800"
  };

  return (
    <div
      className={`inline-flex items-center border rounded-full px-2.5 py-0.5 text-xs font-semibold 
        ${variantClasses[variant]} ${className || ""}`}
      {...props}
    />
  );
}

export { Badge }; 