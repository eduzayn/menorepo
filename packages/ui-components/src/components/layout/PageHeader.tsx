import React, { ReactNode } from 'react';
import { cn } from '../../utils';

/**
 * Props do componente de cabeçalho da página
 */
export interface PageHeaderProps {
  /** Título principal da página */
  title: string;
  
  /** Subtítulo opcional */
  subtitle?: string;
  
  /** URL para voltar (opcional) */
  backUrl?: string;
  
  /** Ícone personalizado para o botão voltar */
  backIcon?: ReactNode;
  
  /** Função para navegação ao clicar no botão voltar */
  onBackClick?: () => void;
  
  /** Conteúdo adicional a ser renderizado na direita (opcional) */
  actions?: ReactNode;
  
  /** Classes adicionais */
  className?: string;
}

/**
 * Componente de cabeçalho padronizado para páginas
 * 
 * @example
 * ```tsx
 * <PageHeader
 *   title="Gerenciar Usuários"
 *   subtitle="Visualize e gerencie todos os usuários do sistema"
 *   backUrl="/dashboard"
 *   actions={<Button>Adicionar Usuário</Button>}
 * />
 * ```
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backUrl,
  backIcon,
  onBackClick,
  actions,
  className = ''
}) => {
  // Handler para o botão voltar
  const handleBackClick = (e: React.MouseEvent) => {
    if (onBackClick) {
      e.preventDefault();
      onBackClick();
    }
  };
  
  return (
    <div className={cn(
      "flex flex-col md:flex-row md:items-center justify-between py-4 mb-6",
      className
    )}>
      <div className="flex flex-col">
        {(backUrl || onBackClick) && (
          <a 
            href={backUrl} 
            onClick={handleBackClick}
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center"
          >
            {backIcon || (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
            )}
            Voltar
          </a>
        )}
        
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      
      {actions && (
        <div className="mt-4 md:mt-0 flex-shrink-0 flex items-center">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader; 