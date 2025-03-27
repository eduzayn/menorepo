import { ApiClient } from '@edunexia/api-client'
import { DbMatricula, MatriculaStatus } from '@edunexia/database-schema'
import { AppError } from '../lib/errors'
import { MatriculaDetalhada, Matricula } from '../types/matricula'
import { matriculaSchema } from '../schemas/matricula'

const ITEMS_PER_PAGE = 10

export interface MatriculaFilters {
  status?: MatriculaStatus
  alunoId?: string
  cursoId?: string
  dataInicio?: Date
  dataFim?: Date
  page?: number
  perPage?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

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
  }
}) 