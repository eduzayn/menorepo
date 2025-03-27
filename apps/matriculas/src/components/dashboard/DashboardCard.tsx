import { ReactNode } from 'react'

interface DashboardCardProps {
  title: string
  value?: string | number
  icon?: ReactNode
  trend?: {
    value: number
    isPositive: boolean
    label: string
  }
  className?: string
  children?: ReactNode
  isLoading?: boolean
}

export const DashboardCard = ({
  title,
  value,
  icon,
  trend,
  className = '',
  children,
  isLoading = false
}: DashboardCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-5 ${className}`}>
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
          
          {trend && (
            <div className="flex items-center text-sm mt-1">
              <span className={`mr-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-gray-500">{trend.label}</span>
            </div>
          )}
          
          {children}
        </>
      )}
    </div>
  )
} 