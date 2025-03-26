import React from 'react';

/**
 * Props do componente de carregamento
 */
interface LoaderProps {
  /** Texto a ser exibido (opcional) */
  text?: string;
  
  /** Tamanho do loader (pequeno, médio, grande) */
  size?: 'sm' | 'md' | 'lg';
  
  /** Classes adicionais */
  className?: string;
  
  /** Indica se o loader ocupa toda a página */
  fullPage?: boolean;
}

/**
 * Componente de carregamento padronizado
 */
export function Loader({
  text,
  size = 'md',
  className = '',
  fullPage = false
}: LoaderProps) {
  // Mapeamento de tamanhos para classes
  const sizeClasses = {
    sm: 'loader-sm',
    md: 'loader-md',
    lg: 'loader-lg'
  };
  
  // Criar classe base
  const baseClass = `loader ${sizeClasses[size]} ${className}`;
  
  // Se for página completa, adiciona container
  if (fullPage) {
    return (
      <div className="loader-fullpage">
        <div className={baseClass}>
          <div className="loader-spinner" />
          {text && <p className="loader-text">{text}</p>}
        </div>
      </div>
    );
  }
  
  // Caso contrário, apenas o loader
  return (
    <div className={baseClass}>
      <div className="loader-spinner" />
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
} 