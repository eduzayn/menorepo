import React, { ReactNode } from 'react';

export interface StatsCardProps {
  /**
   * Título do card estatístico
   */
  title: string;
  
  /**
   * Valor principal a ser exibido
   */
  value: string | number;
  
  /**
   * Ícone do card (ReactNode para suportar diferentes bibliotecas de ícones)
   */
  icon?: ReactNode;
  
  /**
   * Cor de fundo do ícone
   */
  iconBgColor?: string;
  
  /**
   * Descrição adicional (texto auxiliar)
   */
  description?: string;
  
  /**
   * Informações de tendência/comparação
   */
  trend?: {
    value: number;
    isPositive: boolean;
    text?: string;
  };
  
  /**
   * Estado de carregamento
   */
  isLoading?: boolean;
  
  /**
   * Classe CSS adicional
   */
  className?: string;
  
  /**
   * Link para navegação ao clicar no card
   */
  to?: string;
}

/**
 * Componente para exibir estatísticas em formato de card
 * 
 * @example
 * ```tsx
 * <StatsCard
 *   title="Total de Alunos"
 *   value={1243}
 *   icon={<UserIcon />}
 *   iconBgColor="bg-blue-100"
 *   trend={{ value: 12, isPositive: true, text: "vs. mês anterior" }}
 * />
 * ```
 */
export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconBgColor = 'bg-primary-100',
  description,
  trend,
  isLoading = false,
  className = '',
  to
}) => {
  const cardContent = (
    <div className={`bg-white rounded-lg shadow-sm p-5 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          
          {isLoading ? (
            <div className="animate-pulse h-8 w-24 bg-gray-200 rounded my-2"></div>
          ) : (
            <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
          )}
          
          {description && !isLoading && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
          
          {trend && !isLoading && (
            <div className="mt-2 flex items-center text-sm">
              <span
                className={`mr-1 ${
                  trend.isPositive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-gray-500">{trend.text || 'comparado ao período anterior'}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`rounded-full ${iconBgColor} p-3 text-primary`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );

  // Se tiver um link, envolver em um elemento clicável
  if (to) {
    return (
      <a href={to} className="block transition-transform hover:scale-[1.02]">
        {cardContent}
      </a>
    );
  }

  return cardContent;
};

export default StatsCard; 