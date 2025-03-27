import { useMemo } from 'react'
import { DashboardCard } from './DashboardCard'
import { DadosPorPeriodo } from '../../services/dashboardService'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartMatriculasPorPeriodoProps {
  title: string
  data: DadosPorPeriodo[]
  isLoading: boolean
  colorLine?: string
  tooltipLabel?: string
  height?: number
}

export const ChartMatriculasPorPeriodo = ({
  title,
  data,
  isLoading,
  colorLine = '#4F9CF9',
  tooltipLabel = 'Matrículas',
  height = 300
}: ChartMatriculasPorPeriodoProps) => {
  // Formatar datas para melhor exibição no gráfico
  const formattedData = useMemo(() => {
    return data?.map(item => {
      const date = new Date(item.periodo)
      let formattedDate = item.periodo
      
      // Verifica se é uma data válida
      if (!isNaN(date.getTime())) {
        // Formata como DD/MM
        formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`
      }
      
      return {
        periodo: formattedDate,
        valor: item.valor
      }
    }) || []
  }, [data])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-medium">{label}</p>
          <p className="text-gray-700">
            {tooltipLabel}: <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <DashboardCard
      title={title}
      className="h-full"
      isLoading={isLoading}
    >
      {formattedData.length > 0 ? (
        <div style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="periodo" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="valor"
                stroke={colorLine}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Nenhum dado disponível para o período</p>
        </div>
      )}
    </DashboardCard>
  )
} 