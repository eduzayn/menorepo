import { useState, useEffect } from 'react'
import {
  AcademicCapIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'
import { 
  DashboardFilter, 
  ChartMatriculasPorStatus,
  ChartMatriculasPorPeriodo,
  ChartCursosPopulares
} from '../../components/dashboard'
import { dashboardService } from '../../services/index'
import { DashboardFilters, CursoPopularidade, StatusMatriculaChart, DashboardSummary } from '../../services/dashboardService'
import { formatCurrency } from '../../utils/formatters'
import { StatsCard } from '@edunexia/ui-components'

export const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [cursos, setCursos] = useState<{ id: string; nome: string }[]>([])
  const [filters, setFilters] = useState<DashboardFilters>(() => {
    // Definir período padrão de 30 dias
    const dataFim = new Date()
    const dataInicio = new Date()
    dataInicio.setDate(dataInicio.getDate() - 30)
    
    return {
      dataInicio,
      dataFim,
      periodo: 'mes'
    }
  })
  
  const [summaryData, setSummaryData] = useState<DashboardSummary | null>(null)
  const [statusChart, setStatusChart] = useState<StatusMatriculaChart[]>([])
  const [cursosPopulares, setCursosPopulares] = useState<CursoPopularidade[]>([])

  // Carregar dados dos cursos para os filtros
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        // Em um ambiente real, buscaríamos os cursos da API
        const cursosSimulados = [
          { id: '1', nome: 'Análise e Desenvolvimento de Sistemas' },
          { id: '2', nome: 'Engenharia de Software' },
          { id: '3', nome: 'Design Gráfico' },
          { id: '4', nome: 'Administração' },
          { id: '5', nome: 'Ciências Contábeis' },
          { id: '6', nome: 'Marketing Digital' },
        ]
        setCursos(cursosSimulados)
      } catch (error) {
        console.error('Erro ao carregar cursos:', error)
      }
    }

    fetchCursos()
  }, [])

  // Carregar dados do dashboard com base nos filtros
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        // Carregar dados do dashboard
        const summary = await dashboardService.getDashboardSummary(filters)
        setSummaryData(summary)
        
        // Carregar dados para os gráficos
        const statusData = await dashboardService.getStatusMatriculaChart()
        setStatusChart(statusData)
        
        const cursosData = await dashboardService.getCursosPopulares(filters)
        setCursosPopulares(cursosData)
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [filters])

  // Atualizar filtros
  const handleFilterChange = (newFilters: DashboardFilters) => {
    setFilters(newFilters)
  }

  // Calcular percentual de crescimento das matrículas (simulado)
  const calcularCrescimento = () => {
    // Em um ambiente real, isso seria calculado com base em períodos anteriores
    if (!summaryData) return 0
    
    // Simulação de crescimento
    const totalAnterior = 120 // valor simulado do mês anterior
    const diferenca = summaryData.matriculasRecentes - totalAnterior
    return diferenca === 0 ? 0 : (diferenca / totalAnterior) * 100
  }

  return (
    <div className="py-6">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center mb-6">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard de Matrículas</h1>
            <p className="mt-2 text-sm text-gray-700">
              Visão geral das métricas de matrículas, cursos e status financeiro.
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <DashboardFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            cursos={cursos}
            isLoading={isLoading}
          />
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Total de Matrículas"
            value={summaryData?.totalMatriculas || 0}
            icon={<UserGroupIcon className="h-6 w-6" />}
            className="bg-white"
            trend={{
              value: calcularCrescimento(),
              isPositive: calcularCrescimento() >= 0,
              text: "vs. período anterior"
            }}
            isLoading={isLoading}
          />
          
          <StatsCard
            title="Matrículas Recentes"
            value={summaryData?.matriculasRecentes || 0}
            icon={<ClipboardDocumentListIcon className="h-6 w-6" />}
            className="bg-white"
            description={`Nos últimos ${filters.periodo === 'mes' ? '30 dias' : 'dias'}`}
            isLoading={isLoading}
          />
          
          <StatsCard
            title="Total de Cursos"
            value={summaryData?.totalCursos || 0}
            icon={<AcademicCapIcon className="h-6 w-6" />}
            className="bg-white"
            isLoading={isLoading}
          />
          
          <StatsCard
            title="Total de Alunos"
            value={summaryData?.totalAlunos || 0}
            icon={<ArrowTrendingUpIcon className="h-6 w-6" />}
            className="bg-white"
            isLoading={isLoading}
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartMatriculasPorStatus
            data={statusChart}
            isLoading={isLoading}
          />
          
          <ChartCursosPopulares
            data={cursosPopulares}
            isLoading={isLoading}
          />
        </div>
        
        <div className="mb-6">
          <ChartMatriculasPorPeriodo
            title="Novas Matrículas por Período"
            data={summaryData?.novasMatriculasPorDia || []}
            isLoading={isLoading}
            tooltipLabel="Matrículas"
            height={350}
          />
        </div>
      </div>
    </div>
  )
} 