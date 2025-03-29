import * as React from "react";
import { cn } from "../../utils";

export interface NavigationProps {
  /**
   * Elementos filhos do componente
   */
  children: React.ReactNode;
  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function Navigation({ children, className }: NavigationProps) {
  return (
    <nav className={cn("flex items-center space-x-4", className)}>
      {children}
    </nav>
  );
}

export interface NavigationItemProps {
  /**
   * Conteúdo a ser renderizado
   */
  children: React.ReactNode;
  /**
   * Indica se o item está ativo
   */
  active?: boolean;
  /**
   * Classes CSS adicionais
   */
  className?: string;
  /**
   * Handler para onClick
   */
  onClick?: () => void;
  /**
   * URL de destino
   */
  href?: string;
}

export function NavigationItem({
  children,
  active,
  className,
  onClick,
  href,
}: NavigationItemProps) {
  const itemClass = cn(
    "text-sm font-medium transition-colors hover:text-primary",
    active ? "text-primary" : "text-muted-foreground",
    className
  );

  if (href) {
    return (
      <a href={href} className={itemClass} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button className={itemClass} onClick={onClick}>
      {children}
    </button>
  );
} 