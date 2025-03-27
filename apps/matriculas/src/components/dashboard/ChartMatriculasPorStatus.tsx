import { useEffect, useState } from 'react'
import { DashboardCard } from './DashboardCard'
import { StatusMatriculaChart } from '../../services/dashboardService'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#6B66FF']

const STATUS_LABELS: Record<string, string> = {
  'pendente': 'Pendente',
  'ativa': 'Ativa',
  'cancelada': 'Cancelada',
  'trancada': 'Trancada',
  'concluida': 'Concluída',
  'em_processo': 'Em Processo',
  'inadimplente': 'Inadimplente',
  'reativada': 'Reativada'
}

interface ChartMatriculasPorStatusProps {
  data: StatusMatriculaChart[]
  isLoading: boolean
}

export const ChartMatriculasPorStatus = ({ data, isLoading }: ChartMatriculasPorStatusProps) => {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (data?.length) {
      setChartData(data.map(item => ({
        name: STATUS_LABELS[item.status] || item.status,
        value: item.quantidade
      })))
    }
  }, [data])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-gray-700">
            <span className="font-semibold">{payload[0].value}</span> matrículas
          </p>
          <p className="text-sm text-gray-500">
            {payload[0].payload.percentual?.toFixed(1)}% do total
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <DashboardCard
      title="Matrículas por Status"
      className="h-full"
      isLoading={isLoading}
    >
      {chartData.length > 0 ? (
        <div className="h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500">Nenhum dado disponível</p>
        </div>
      )}
    </DashboardCard>
  )
} 