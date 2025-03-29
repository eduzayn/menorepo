import * as React from "react";
import { cn } from "../../utils";

interface ContainerProps {
  /**
   * Elementos filhos do componente
   */
  children: React.ReactNode;
  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("container mx-auto px-4 md:px-6", className)}>
      {children}
    </div>
  );
}

export interface GridProps {
  /**
   * Elementos filhos do componente
   */
  children: React.ReactNode;
  /**
   * Classes CSS adicionais
   */
  className?: string;
  /**
   * Número de colunas (1-12)
   */
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /**
   * Tamanho do gap entre os itens
   */
  gap?: 'none' | 'sm' | 'md' | 'lg';
}

export function Grid({
  children,
  className,
  cols = 12,
  gap = 'md',
}: GridProps) {
  const gapClass = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
    11: 'grid-cols-11',
    12: 'grid-cols-12',
  };

  return (
    <div className={cn("grid", colsClass[cols], gapClass[gap], className)}>
      {children}
    </div>
  );
}

export interface BoxProps {
  /**
   * Elementos filhos do componente
   */
  children: React.ReactNode;
  /**
   * Classes CSS adicionais
   */
  className?: string;
  /**
   * Padding interno
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Box({
  children,
  className,
  padding = 'md',
}: BoxProps) {
  const paddingClass = {
    none: 'p-0',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div className={cn("bg-card rounded-lg shadow", paddingClass[padding], className)}>
      {children}
    </div>
  );
} 