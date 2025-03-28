import React, { ReactNode } from 'react';

/**
 * Props do componente de cabeçalho da página
 */
interface PageHeaderProps {
  /** Título principal da página */
  title: string;
  
  /** Subtítulo opcional */
  subtitle?: string;
  
  /** URL para voltar (opcional) */
  backUrl?: string;
  
  /** Conteúdo adicional a ser renderizado na direita (opcional) */
  actions?: ReactNode;
  
  /** Classes adicionais */
  className?: string;
}

/**
 * Componente de cabeçalho padronizado para páginas
 */
export function PageHeader({
  title,
  subtitle,
  backUrl,
  actions,
  className = ''
}: PageHeaderProps) {
  return (
    <div className={`page-header ${className}`}>
      <div className="page-header-content">
        {backUrl && (
          <a href={backUrl} className="page-header-back">
            &larr; Voltar
          </a>
        )}
        
        <div className="page-header-titles">
          <h1 className="page-header-title">{title}</h1>
          {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
        </div>
      </div>
      
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
} 