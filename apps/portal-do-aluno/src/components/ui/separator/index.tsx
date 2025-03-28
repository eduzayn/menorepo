/**
 * Componente Separator - simples implementação para o Portal de Negociações
 */

import * as React from "react";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

function Separator({
  className = "",
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) {
  const ariaOrientation = decorative ? undefined : orientation;

  return (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation={ariaOrientation}
      className={`shrink-0 bg-gray-200 
        ${orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"}
        ${className}`}
      {...props}
    />
  );
}

export { Separator }; 