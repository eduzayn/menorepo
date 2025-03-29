import { useMemo } from 'react'
import { DashboardCard } from '@edunexia/ui-components'
import { CursoPopularidade } from '../../services/dashboardService'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts'

interface ChartCursosPopularesProps {
  data: CursoPopularidade[]
  isLoading: boolean
}

export const ChartCursosPopulares = ({ data, isLoading }: ChartCursosPopularesProps) => {
  // Preparar dados para o gráfico (limitar a 5 cursos mais populares)
  const chartData = useMemo(() => {
    // Ordenar por número de matrículas e pegar os 5 primeiros
    return [...(data || [])]
      .sort((a, b) => b.matriculas - a.matriculas)
      .slice(0, 5)
      // Se o nome do curso for muito longo, truncar
      .map(curso => ({
        ...curso,
        nome: curso.cursoNome.length > 20 
          ? curso.cursoNome.substring(0, 20) + '...' 
          : curso.cursoNome
      }))
  }, [data])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const curso = payload[0].payload
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-medium">{curso.cursoNome}</p>
          <p className="text-gray-700">
            Matrículas: <span className="font-semibold">{curso.matriculas}</span>
          </p>
          <p className="text-gray-500 text-sm">
            {curso.percentual.toFixed(1)}% do total
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <DashboardCard
      title="Cursos Mais Populares"
      className="h-full"
      isLoading={isLoading}
    >
      {chartData.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis 
                dataKey="nome" 
                type="category" 
                tick={{ fontSize: 12 }}
                width={150}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="matriculas" 
                fill="#4F9CF9" 
                radius={[0, 4, 4, 0]}
              >
                <LabelList dataKey="matriculas" position="right" />
              </Bar>
            </BarChart>
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