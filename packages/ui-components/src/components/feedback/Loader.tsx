import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Props do componente de loader
 */
export interface LoaderProps {
  /** Texto a ser exibido (opcional) */
  text?: string;
  
  /** Tamanho do loader (pequeno, médio, grande) */
  size?: 'sm' | 'md' | 'lg';
  
  /** Classes adicionais */
  className?: string;
  
  /** Indica se o loader ocupa toda a página */
  fullPage?: boolean;
  
  /** Cor do loader (opcional) */
  color?: 'primary' | 'secondary' | 'neutral' | 'white';
}

/**
 * Componente de carregamento padronizado com estilos Tailwind
 * 
 * @example
 * ```tsx
 * <Loader text="Carregando..." size="md" />
 * ```
 */
export const Loader: React.FC<LoaderProps> = ({
  text,
  size = 'md',
  className,
  fullPage = false,
  color = 'primary'
}) => {
  // Mapeamento de tamanhos para classes
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3'
  };
  
  // Mapeamento de cores para classes
  const colorClasses = {
    primary: 'border-blue-500 border-t-transparent',
    secondary: 'border-purple-500 border-t-transparent',
    neutral: 'border-gray-500 border-t-transparent',
    white: 'border-white border-t-transparent'
  };
  
  // Elemento base do spinner
  const spinner = (
    <div 
      className={cn(
        'animate-spin rounded-full',
        sizeClasses[size],
        colorClasses[color]
      )}
    />
  );
  
  // Contêiner para texto e spinner
  const loaderContent = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      {spinner}
      {text && <p className="text-sm font-medium">{text}</p>}
    </div>
  );
  
  // Se for página completa, renderiza com fundo e centralizado
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          {loaderContent}
        </div>
      </div>
    );
  }
  
  // Caso contrário, apenas o loader
  return loaderContent;
};

export default Loader; 