import { ApiClient } from '@edunexia/api-client'
import { ITEMS_PER_PAGE } from '../constants'
import { AppError } from '../errors/AppError'
import { matriculaSchema, matriculaFiltersSchema } from '../schemas/matricula'
import { 
  Matricula, 
  MatriculaFilters,
  PaginatedResponse,
  SolicitacaoCancelamento, 
  SolicitacaoCancelamentoForm,
  StatusSolicitacaoCancelamento,
  AnaliseCancelamentoForm
} from '../types/matricula'
import { DbMatricula, MatriculaStatus } from '@edunexia/database-schema'
import { MatriculaDetalhada } from '../types/matricula'

export const matriculaKeys = {
  all: ['matriculas'] as const,
  lists: () => [...matriculaKeys.all, 'list'] as const,
  list: (filters: MatriculaFilters) => [...matriculaKeys.lists(), filters] as const,
  details: () => [...matriculaKeys.all, 'detail'] as const,
  detail: (id: string) => [...matriculaKeys.details(), id] as const,
}

export const createMatriculaService = (apiClient: ApiClient) => ({
  async listarMatriculas(filters?: MatriculaFilters): Promise<PaginatedResponse<Matricula>> {
    try {
      const page = filters?.page || 1
      const perPage = filters?.perPage || ITEMS_PER_PAGE
      
      // Construir query para o Supabase
      let query = apiClient.supabase
        .from('matriculas')
        .select('*', { count: 'exact' })
      
      if (filters?.alunoId) {
        query = query.eq('aluno_id', filters.alunoId)
      }
      
      if (filters?.cursoId) {
        query = query.eq('curso_id', filters.cursoId)
      }
      
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      
      if (filters?.dataInicio) {
        query = query.gte('data_inicio', filters.dataInicio.toISOString())
      }
      
      if (filters?.dataFim) {
        query = query.lte('data_inicio', filters.dataFim.toISOString())
      }
      
      // Paginação
      const from = (page - 1) * perPage
      const to = from + perPage - 1
      
      query = query
        .order('created_at', { ascending: false })
        .range(from, to)
      
      const { data, error, count } = await query
      
      if (error) throw error
      
      // Converter DbMatricula para Matricula
      const matriculas = data?.map((item: DbMatricula) => ({
        id: item.id,
        alunoId: item.aluno_id,
        cursoId: item.curso_id,
        planoPagamentoId: item.plano_pagamento_id,
        status: item.status,
        dataInicio: new Date(item.data_inicio),
        dataFim: item.data_conclusao_efetiva ? new Date(item.data_conclusao_efetiva) : undefined,
        observacoes: item.observacoes || undefined,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at)
      })) || []
      
      return {
        items: matriculas,
        total: count || 0,
        page,
        perPage,
        totalPages: count ? Math.ceil(count / perPage) : 0
      }
    } catch (error) {
      throw new AppError('Erro ao listar matrículas', error)
    }
  },

  async buscarMatricula(id: string): Promise<Matricula | null> {
    try {
      const { data, error } = await apiClient.supabase
        .from('matriculas')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      if (!data) return null
      
      // Converter DbMatricula para Matricula
      return {
        id: data.id,
        alunoId: data.aluno_id,
        cursoId: data.curso_id,
        planoPagamentoId: data.plano_pagamento_id,
        status: data.status,
        dataInicio: new Date(data.data_inicio),
        dataFim: data.data_conclusao_efetiva ? new Date(data.data_conclusao_efetiva) : undefined,
        observacoes: data.observacoes || undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      }
    } catch (error) {
      throw new AppError('Erro ao buscar matrícula', error)
    }
  },

  async criarMatricula(data: any): Promise<Matricula | null> {
    try {
      // Validar dados com o schema
      const validated = matriculaSchema.parse(data)
      
      const { data: newMatricula, error } = await apiClient.supabase
        .from('matriculas')
        .insert({
          aluno_id: validated.aluno_id,
          curso_id: validated.curso_id,
          plano_pagamento_id: validated.plano_id,
          status: validated.status,
          data_inicio: validated.data_inicio,
          data_conclusao_prevista: validated.data_conclusao_prevista,
          observacoes: validated.observacoes,
          instituicao_id: data.instituicao_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('*')
        .single()
      
      if (error) throw error
      if (!newMatricula) return null
      
      // Converter DbMatricula para Matricula
      return {
        id: newMatricula.id,
        alunoId: newMatricula.aluno_id,
        cursoId: newMatricula.curso_id,
        planoPagamentoId: newMatricula.plano_pagamento_id,
        status: newMatricula.status,
        dataInicio: new Date(newMatricula.data_inicio),
        dataFim: newMatricula.data_conclusao_efetiva ? new Date(newMatricula.data_conclusao_efetiva) : undefined,
        observacoes: newMatricula.observacoes || undefined,
        createdAt: new Date(newMatricula.created_at),
        updatedAt: new Date(newMatricula.updated_at)
      }
    } catch (error) {
      throw new AppError('Erro ao criar matrícula', error)
    }
  },

  async atualizarMatricula(id: string, data: any): Promise<Matricula | null> {
    try {
      const { data: updated, error } = await apiClient.supabase
        .from('matriculas')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single()
      
      if (error) throw error
      if (!updated) return null
      
      // Converter DbMatricula para Matricula
      return {
        id: updated.id,
        alunoId: updated.aluno_id,
        cursoId: updated.curso_id,
        planoPagamentoId: updated.plano_pagamento_id,
        status: updated.status,
        dataInicio: new Date(updated.data_inicio),
        dataFim: updated.data_conclusao_efetiva ? new Date(updated.data_conclusao_efetiva) : undefined,
        observacoes: updated.observacoes || undefined,
        createdAt: new Date(updated.created_at),
        updatedAt: new Date(updated.updated_at)
      }
    } catch (error) {
      throw new AppError('Erro ao atualizar matrícula', error)
    }
  },

  async cancelarMatricula(id: string, observacoes?: string): Promise<boolean> {
    try {
      const { error } = await apiClient.supabase
        .from('matriculas')
        .update({
          status: 'cancelada',
          observacoes: observacoes ? `Cancelada: ${observacoes}` : 'Cancelada pelo sistema',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
      
      if (error) throw error
      
      return true
    } catch (error) {
      throw new AppError('Erro ao cancelar matrícula', error)
    }
  },

  async solicitarCancelamento(matriculaId: string, dados: SolicitacaoCancelamentoForm): Promise<SolicitacaoCancelamento> {
    try {
      // Primeiro, buscar a matrícula para garantir que existe e pegar o aluno_id
      const { data: matricula, error: matriculaError } = await apiClient.supabase
        .from('matriculas')
        .select('id, aluno_id, status')
        .eq('id', matriculaId)
        .single()
      
      if (matriculaError) throw matriculaError
      if (!matricula) throw new Error('Matrícula não encontrada')
      
      // Verificar se a matrícula está ativa (ou em outro status que permita cancelamento)
      if (matricula.status !== 'ativa' && matricula.status !== 'inadimplente') {
        throw new Error(`Não é possível solicitar cancelamento para matrículas com status: ${matricula.status}`)
      }
      
      // Criar a solicitação de cancelamento
      const { data, error } = await apiClient.supabase
        .from('solicitacoes_cancelamento')
        .insert({
          matricula_id: matriculaId,
          aluno_id: matricula.aluno_id,
          motivo: dados.motivo,
          descricao: dados.descricao,
          status: 'pendente',
          data_solicitacao: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      throw new AppError('Erro ao solicitar cancelamento da matrícula', error)
    }
  },

  async listarSolicitacoesCancelamento(
    filtros?: {
      status?: StatusSolicitacaoCancelamento,
      dataInicio?: string,
      dataFim?: string,
      page?: number,
      perPage?: number
    }
  ): Promise<PaginatedResponse<SolicitacaoCancelamento>> {
    try {
      const page = filtros?.page || 1
      const perPage = filtros?.perPage || ITEMS_PER_PAGE
      
      // Construir query para o Supabase
      let query = apiClient.supabase
        .from('solicitacoes_cancelamento')
        .select('*, matriculas(id, curso(nome)), alunos(nome)', { count: 'exact' })
      
      if (filtros?.status) {
        query = query.eq('status', filtros.status)
      }
      
      if (filtros?.dataInicio) {
        query = query.gte('data_solicitacao', filtros.dataInicio)
      }
      
      if (filtros?.dataFim) {
        query = query.lte('data_solicitacao', filtros.dataFim)
      }
      
      // Paginação
      const from = (page - 1) * perPage
      const to = from + perPage - 1
      
      query = query
        .order('data_solicitacao', { ascending: false })
        .range(from, to)
      
      const { data, error, count } = await query
      
      if (error) throw error
      
      return {
        data: data || [],
        meta: {
          total: count || 0,
          page,
          perPage,
          pageCount: Math.ceil((count || 0) / perPage)
        }
      }
    } catch (error) {
      throw new AppError('Erro ao listar solicitações de cancelamento', error)
    }
  },

  async obterSolicitacaoCancelamento(id: string): Promise<SolicitacaoCancelamento | null> {
    try {
      const { data, error } = await apiClient.supabase
        .from('solicitacoes_cancelamento')
        .select('*, matriculas(id, curso(nome)), alunos(nome)')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      throw new AppError('Erro ao obter solicitação de cancelamento', error)
    }
  },

  async analisarSolicitacaoCancelamento(id: string, analise: AnaliseCancelamentoForm): Promise<SolicitacaoCancelamento> {
    try {
      // Atualizar a solicitação
      const { data: solicitacao, error: solicitacaoError } = await apiClient.supabase
        .from('solicitacoes_cancelamento')
        .update({
          status: analise.status,
          observacoes_analise: analise.observacoes,
          data_analise: new Date().toISOString(),
          analisado_por: apiClient.session?.user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*, matriculas(id)')
        .single()
      
      if (solicitacaoError) throw solicitacaoError
      
      // Se aprovada, cancelar a matrícula
      if (analise.status === 'aprovada' && solicitacao?.matriculas?.id) {
        await this.cancelarMatricula(
          solicitacao.matriculas.id,
          `Cancelamento solicitado pelo aluno. Motivo: ${solicitacao.motivo}. Observações da análise: ${analise.observacoes}`
        )
      }
      
      return solicitacao
    } catch (error) {
      throw new AppError('Erro ao analisar solicitação de cancelamento', error)
    }
  },

  async processarCancelamentosAutomaticos(): Promise<number> {
    try {
      // Obter data atual e data de 90 dias atrás para inadimplentes
      const dataAtual = new Date()
      const data90DiasAtras = new Date(dataAtual)
      data90DiasAtras.setDate(dataAtual.getDate() - 90)
      
      // Buscar matrículas inadimplentes por mais de 90 dias
      const { data: matriculasParaCancelar, error } = await apiClient.supabase
        .from('matriculas')
        .select('id, aluno_id, status, updated_at')
        .eq('status', 'inadimplente')
        .lt('updated_at', data90DiasAtras.toISOString())
      
      if (error) throw error
      
      let cancelamentosRealizados = 0
      
      // Processar cada matrícula elegível para cancelamento
      for (const matricula of matriculasParaCancelar || []) {
        // Verificar se já existe uma solicitação de cancelamento pendente
        const { data: solicitacoesPendentes, error: solicitacoesError } = await apiClient.supabase
          .from('solicitacoes_cancelamento')
          .select('id')
          .eq('matricula_id', matricula.id)
          .eq('status', 'pendente')
          
        if (solicitacoesError) throw solicitacoesError
        
        // Se não existir solicitação pendente, criar uma automática
        if (!solicitacoesPendentes?.length) {
          await apiClient.supabase
            .from('solicitacoes_cancelamento')
            .insert({
              matricula_id: matricula.id,
              aluno_id: matricula.aluno_id,
              motivo: 'financeiro',
              descricao: 'Cancelamento automático por inadimplência superior a 90 dias',
              status: 'aprovada', // Já aprovado automaticamente
              data_solicitacao: new Date().toISOString(),
              data_analise: new Date().toISOString(),
              analisado_por: 'sistema',
              observacoes_analise: 'Cancelamento automático conforme política da instituição',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            
          // Cancelar a matrícula
          await this.cancelarMatricula(
            matricula.id,
            'Cancelamento automático por inadimplência superior a 90 dias'
          )
          
          cancelamentosRealizados++
        }
      }
      
      return cancelamentosRealizados
    } catch (error) {
      throw new AppError('Erro ao processar cancelamentos automáticos', error)
    }
  }
}) 