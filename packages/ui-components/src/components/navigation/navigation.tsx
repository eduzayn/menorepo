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
    <nav className={cn("flex items-center space-x-4", className)} role="navigation" aria-label="Principal">
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
  /**
   * Abrir em nova aba
   */
  openInNewTab?: boolean;
  /**
   * Componente personalizado para renderizar links 
   * (como Link do react-router-dom ou Next.js)
   */
  LinkComponent?: React.ComponentType<any>;
}

export function NavigationItem({
  children,
  active,
  className,
  onClick,
  href,
  openInNewTab,
  LinkComponent
}: NavigationItemProps) {
  const itemClass = cn(
    "text-sm font-medium transition-colors hover:text-primary",
    active ? "text-primary" : "text-muted-foreground",
    className
  );

  if (href) {
    // Se um componente Link personalizado foi fornecido (React Router, Next.js, etc.)
    if (LinkComponent) {
      return (
        <LinkComponent 
          to={href} // para react-router
          href={href} // para next.js
          className={itemClass}
          onClick={onClick}
          target={openInNewTab ? '_blank' : undefined}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
        >
          {children}
        </LinkComponent>
      );
    }
    
    // Link padrão HTML
    return (
      <a 
        href={href} 
        className={itemClass} 
        onClick={onClick}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button 
      className={itemClass} 
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
} 