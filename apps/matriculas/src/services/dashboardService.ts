import { ApiClient } from '@edunexia/api-client'
import { supabase } from '../lib/supabase'
import { MatriculaStatus } from '@edunexia/database-schema'

// Tipos para relatórios
export interface DashboardSummary {
  totalMatriculas: number
  matriculasPorStatus: Record<MatriculaStatus, number>
  matriculasRecentes: number
  matriculasHoje: number
  totalCursos: number
  totalAlunos: number
  novasMatriculasPorDia: DadosPorPeriodo[]
}

export interface FinanceiroSummary {
  valorTotalRecebido: number
  valorEmAberto: number
  valorVencido: number
  receitaPorMes: DadosPorPeriodo[]
  taxaAdimplencia: number
  valorMedioMensalidade: number
  valorTotalPrevisto: number
}

export interface DadosPorPeriodo {
  periodo: string
  valor: number
}

export interface StatusMatriculaChart {
  status: string
  quantidade: number
  percentual: number
}

export interface CursoPopularidade {
  cursoId: string
  cursoNome: string
  matriculas: number
  percentual: number
}

// Filtros para análises
export interface DashboardFilters {
  dataInicio?: Date
  dataFim?: Date
  cursoId?: string
  periodo?: 'dia' | 'semana' | 'mes' | 'ano'
}

// Serviço de dashboard
export const createDashboardService = (apiClient: ApiClient) => ({
  // Resumo do dashboard principal
  async getDashboardSummary(filters?: DashboardFilters): Promise<DashboardSummary> {
    try {
      // Filtro de data padrão (últimos 30 dias se não especificado)
      const dataFim = filters?.dataFim || new Date()
      const dataInicio = filters?.dataInicio || new Date(dataFim)
      if (!filters?.dataInicio) {
        dataInicio.setDate(dataInicio.getDate() - 30)
      }

      // Contar total de matrículas
      const { count: totalMatriculas } = await apiClient.supabase
        .from('matriculas')
        .select('*', { count: 'exact', head: true })

      // Matrículas por status
      const { data: statusData } = await apiClient.supabase.rpc('contar_matriculas_por_status')
      
      const matriculasPorStatus = statusData?.reduce((acc, curr) => {
        acc[curr.status as MatriculaStatus] = curr.count
        return acc
      }, {} as Record<MatriculaStatus, number>) || {}

      // Matrículas recentes (último mês)
      const { count: matriculasRecentes } = await apiClient.supabase
        .from('matriculas')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dataInicio.toISOString())
        .lte('created_at', dataFim.toISOString())

      // Matrículas de hoje
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)
      const { count: matriculasHoje } = await apiClient.supabase
        .from('matriculas')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', hoje.toISOString())

      // Total de cursos
      const { count: totalCursos } = await apiClient.supabase
        .from('cursos')
        .select('*', { count: 'exact', head: true })

      // Total de alunos únicos
      const { count: totalAlunos } = await apiClient.supabase
        .from('alunos')
        .select('*', { count: 'exact', head: true })

      // Matrículas por dia (últimos 30 dias)
      const { data: matriculasPorDia } = await apiClient.supabase.rpc(
        'matriculas_por_dia',
        { data_inicio: dataInicio.toISOString(), data_fim: dataFim.toISOString() }
      )

      const novasMatriculasPorDia = matriculasPorDia?.map(item => ({
        periodo: item.data,
        valor: item.count
      })) || []

      return {
        totalMatriculas: totalMatriculas || 0,
        matriculasPorStatus,
        matriculasRecentes: matriculasRecentes || 0,
        matriculasHoje: matriculasHoje || 0,
        totalCursos: totalCursos || 0,
        totalAlunos: totalAlunos || 0,
        novasMatriculasPorDia
      }
    } catch (error) {
      console.error('Erro ao buscar resumo do dashboard:', error)
      throw new Error('Falha ao carregar dados do dashboard')
    }
  },

  // Resumo financeiro
  async getFinanceiroSummary(filters?: DashboardFilters): Promise<FinanceiroSummary> {
    try {
      // Filtro de data padrão (últimos 30 dias se não especificado)
      const dataFim = filters?.dataFim || new Date()
      const dataInicio = filters?.dataInicio || new Date(dataFim)
      if (!filters?.dataInicio) {
        dataInicio.setDate(dataInicio.getDate() - 30)
      }

      // Valor total recebido
      const { data: pagosData } = await apiClient.supabase
        .from('pagamentos')
        .select('valor')
        .eq('status', 'paid')
        .gte('data_pagamento', dataInicio.toISOString())
        .lte('data_pagamento', dataFim.toISOString())

      const valorTotalRecebido = pagosData?.reduce((sum, item) => sum + item.valor, 0) || 0

      // Valor em aberto (não vencido)
      const hoje = new Date()
      const { data: abertosData } = await apiClient.supabase
        .from('pagamentos')
        .select('valor')
        .eq('status', 'pending')
        .gt('data_vencimento', hoje.toISOString())

      const valorEmAberto = abertosData?.reduce((sum, item) => sum + item.valor, 0) || 0

      // Valor vencido
      const { data: vencidosData } = await apiClient.supabase
        .from('pagamentos')
        .select('valor')
        .eq('status', 'pending')
        .lt('data_vencimento', hoje.toISOString())

      const valorVencido = vencidosData?.reduce((sum, item) => sum + item.valor, 0) || 0

      // Receita por mês
      const { data: receitaMensal } = await apiClient.supabase.rpc(
        'receita_por_mes',
        { data_inicio: dataInicio.toISOString(), data_fim: dataFim.toISOString() }
      )

      const receitaPorMes = receitaMensal?.map(item => ({
        periodo: item.mes,
        valor: item.valor_total
      })) || []

      // Taxa de adimplência
      const totalPagamentos = (valorTotalRecebido + valorEmAberto + valorVencido) || 1
      const taxaAdimplencia = (valorTotalRecebido / totalPagamentos) * 100

      // Valor médio de mensalidade
      const { data: valorMedioData } = await apiClient.supabase.rpc('valor_medio_mensalidade')
      const valorMedioMensalidade = valorMedioData?.[0]?.valor_medio || 0

      // Valor total previsto para o período
      const { data: totalPrevistoData } = await apiClient.supabase
        .from('pagamentos')
        .select('valor')
        .gte('data_vencimento', dataInicio.toISOString())
        .lte('data_vencimento', dataFim.toISOString())

      const valorTotalPrevisto = totalPrevistoData?.reduce((sum, item) => sum + item.valor, 0) || 0

      return {
        valorTotalRecebido,
        valorEmAberto,
        valorVencido,
        receitaPorMes,
        taxaAdimplencia,
        valorMedioMensalidade,
        valorTotalPrevisto
      }
    } catch (error) {
      console.error('Erro ao buscar resumo financeiro:', error)
      throw new Error('Falha ao carregar dados financeiros')
    }
  },

  // Cursos mais populares
  async getCursosPopulares(filters?: DashboardFilters): Promise<CursoPopularidade[]> {
    try {
      const { data } = await apiClient.supabase.rpc('cursos_populares', {
        limite: 10
      })

      const total = data?.reduce((sum, curso) => sum + curso.matriculas, 0) || 1

      return data?.map(curso => ({
        cursoId: curso.curso_id,
        cursoNome: curso.curso_nome,
        matriculas: curso.matriculas,
        percentual: (curso.matriculas / total) * 100
      })) || []
    } catch (error) {
      console.error('Erro ao buscar cursos populares:', error)
      throw new Error('Falha ao carregar dados de cursos populares')
    }
  },

  // Detalhamento de status de matrículas
  async getStatusMatriculaChart(): Promise<StatusMatriculaChart[]> {
    try {
      const { data } = await apiClient.supabase.rpc('contar_matriculas_por_status')
      
      const total = data?.reduce((sum, status) => sum + status.count, 0) || 1

      return data?.map(status => ({
        status: status.status,
        quantidade: status.count,
        percentual: (status.count / total) * 100
      })) || []
    } catch (error) {
      console.error('Erro ao buscar gráfico de status:', error)
      throw new Error('Falha ao carregar dados de status')
    }
  },

  // Relatório de eficiência de conversão
  async getConversaoMatriculas(filters?: DashboardFilters): Promise<{
    taxaConversao: number,
    leadsPorStatus: Record<string, number>,
    tempoMedioConversao: number
  }> {
    try {
      // Aqui poderia integrar com módulo de leads/CRM, implementando
      // quando este estiver disponível
      return {
        taxaConversao: 68.5, // Valor simulado 
        leadsPorStatus: {
          'novo': 32,
          'contatado': 28,
          'interessado': 45,
          'inscrito': 38,
          'matriculado': 21
        },
        tempoMedioConversao: 3.2 // Dias (simulado)
      }
    } catch (error) {
      console.error('Erro ao buscar dados de conversão:', error)
      throw new Error('Falha ao carregar dados de conversão')
    }
  }
})

// Para uso direto sem API Client
const dashboardService = {
  ...createDashboardService({ supabase } as ApiClient),
}

export default dashboardService 