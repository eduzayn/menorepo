import { ReactNode } from 'react'

export interface DashboardCardProps {
  /**
   * Título do card
   */
  title: string
  
  /**
   * Valor principal a ser exibido
   */
  value?: string | number
  
  /**
   * Ícone a ser exibido
   */
  icon?: ReactNode
  
  /**
   * Informações de tendência
   */
  trend?: {
    /** Valor da tendência em porcentagem */
    value: number
    /** Se a tendência é positiva */
    isPositive: boolean
    /** Texto explicativo sobre a tendência */
    text?: string
  }
  
  /**
   * Classes CSS adicionais
   */
  className?: string
  
  /**
   * Conteúdo adicional do card
   */
  children?: ReactNode
  
  /**
   * Se o card está em estado de carregamento
   */
  isLoading?: boolean
  
  /**
   * Descrição ou subtítulo do card
   */
  description?: string
  
  /**
   * URL para navegação ao clicar no card
   */
  to?: string
  
  /**
   * Função chamada ao clicar no card
   */
  onClick?: () => void
}

/**
 * Card para exibição de informações em dashboards
 */
export const DashboardCard = ({
  title,
  value,
  icon,
  trend,
  className = '',
  children,
  isLoading = false,
  description,
  to,
  onClick
}: DashboardCardProps) => {
  // Criar wrapper com link se "to" for fornecido
  const CardWrapper = ({ children }: { children: ReactNode }) => {
    const wrapperProps = {
      className: `bg-white rounded-lg shadow-sm p-5 ${to || onClick ? 'cursor-pointer hover:shadow transition-shadow' : ''} ${className}`,
      onClick: onClick || (to ? () => window.location.href = to : undefined)
    }
    
    return <div {...wrapperProps}>{children}</div>
  }
  
  return (
    <CardWrapper>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      
      {isLoading ? (
        <div className="animate-pulse h-10 w-3/4 bg-gray-200 rounded"></div>
      ) : (
        <>
          {value !== undefined && (
            <div className="text-2xl font-bold text-gray-800 mb-2">{value}</div>
          )}
          
          {description && (
            <div className="text-sm text-gray-500 mb-2">{description}</div>
          )}
          
          {trend && (
            <div className="flex items-center text-sm mt-1">
              <span className={`mr-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-gray-500">{trend.text}</span>
            </div>
          )}
          
          {children}
        </>
      )}
    </CardWrapper>
  )
} 