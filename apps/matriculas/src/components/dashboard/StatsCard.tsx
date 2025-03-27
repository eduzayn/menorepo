import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  iconBgColor?: string
  description?: string
  change?: {
    value: number
    isPositive: boolean
    text: string
  }
  isLoading?: boolean
}

export const StatsCard = ({
  title,
  value,
  icon,
  iconBgColor = 'bg-blue-100',
  description,
  change,
  isLoading = false
}: StatsCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex justify-between">
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
          
          {change && !isLoading && (
            <div className="mt-2 flex items-center text-sm">
              <span
                className={`mr-1 ${
                  change.isPositive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
              </span>
              <span className="text-gray-500">{change.text}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`rounded-full ${iconBgColor} p-3 text-blue-600`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
} 