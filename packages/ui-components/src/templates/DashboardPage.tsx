import React, { ReactNode } from 'react';

export interface DashboardPageTemplateProps {
  /**
   * Título principal da página
   */
  title: string;
  
  /**
   * Subtítulo ou descrição
   */
  subtitle?: string;
  
  /**
   * Ações/botões para o cabeçalho da página (ex: botão de adicionar)
   */
  headerActions?: ReactNode;
  
  /**
   * Conteúdo dos cards de estatísticas
   */
  statsCards?: ReactNode;
  
  /**
   * Conteúdo principal da página
   */
  children: ReactNode;
  
  /**
   * Indicador de carregamento
   */
  isLoading?: boolean;
  
  /**
   * Filtros para o dashboard (opcional)
   */
  filters?: ReactNode;
  
  /**
   * Mensagem de erro (se houver)
   */
  error?: string | null;
}

/**
 * Template padronizado para páginas de dashboard
 * 
 * @example
 * ```tsx
 * <DashboardPageTemplate
 *   title="Dashboard de Vendas"
 *   subtitle="Acompanhe suas métricas de vendas"
 *   headerActions={<Button>Nova Venda</Button>}
 *   statsCards={
 *     <>
 *       <StatsCard title="Total" value={1500} />
 *       <StatsCard title="Mês Atual" value={350} />
 *     </>
 *   }
 * >
 *   <div>Conteúdo principal...</div>
 * </DashboardPageTemplate>
 * ```
 */
export const DashboardPageTemplate: React.FC<DashboardPageTemplateProps> = ({
  title,
  subtitle,
  headerActions,
  statsCards,
  children,
  isLoading = false,
  filters,
  error
}) => {
  return (
    <div className="py-6">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-sm text-gray-700">{subtitle}</p>
            )}
          </div>
          
          {headerActions && (
            <div className="mt-4 sm:mt-0 sm:flex-none">{headerActions}</div>
          )}
        </div>
        
        {/* Filtros (se fornecidos) */}
        {filters && (
          <div className="mb-6">
            {filters}
          </div>
        )}
        
        {/* Exibe erro se houver */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {/* Cards de estatísticas */}
        {statsCards && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statsCards}
          </div>
        )}
        
        {/* Conteúdo principal */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default DashboardPageTemplate; 