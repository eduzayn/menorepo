import { DbMatricula, MatriculaStatus } from '@edunexia/database-schema'
import { supabase } from '../lib/supabase'
import { MatriculaDetalhada, Matricula } from '../types/matricula'
import { matriculaSchema } from '../schemas/matricula'
import { AppError } from '../lib/errors'
import type { MatriculaStatus as MatriculaStatusType } from '../types/matricula'

const ITEMS_PER_PAGE = 10

export interface MatriculaFilters {
  status?: MatriculaStatusType
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

export const matriculaService = {
  async listarMatriculas(filters?: MatriculaFilters): Promise<PaginatedResponse<unknown>> {
    try {
      const page = filters?.page || 1
      const perPage = filters?.perPage || 10
      
      const queryParams = new URLSearchParams()
      
      if (filters?.alunoId) {
        queryParams.append('alunoId', filters.alunoId)
      }
      
      if (filters?.cursoId) {
        queryParams.append('cursoId', filters.cursoId)
      }
      
      if (filters?.status) {
        queryParams.append('status', filters.status)
      }
      
      if (filters?.dataInicio) {
        queryParams.append('dataInicio', filters.dataInicio.toISOString())
      }
      
      if (filters?.dataFim) {
        queryParams.append('dataFim', filters.dataFim.toISOString())
      }
      
      queryParams.append('page', page.toString())
      queryParams.append('perPage', perPage.toString())
      
      // TODO: Implementar chamada à API
      return {
        items: [],
        total: 0,
        page,
        perPage,
        totalPages: 0
      }
    } catch (error) {
      throw new AppError('Erro ao listar matrículas', error)
    }
  },

  async buscarMatricula(id: string) {
    try {
      // TODO: Implementar chamada à API
      return null
    } catch (error) {
      throw new AppError('Erro ao buscar matrícula', error)
    }
  },

  async criarMatricula(data: unknown) {
    try {
      // TODO: Implementar chamada à API
      return null
    } catch (error) {
      throw new AppError('Erro ao criar matrícula', error)
    }
  },

  async atualizarMatricula(id: string, data: unknown) {
    try {
      // TODO: Implementar chamada à API
      return null
    } catch (error) {
      throw new AppError('Erro ao atualizar matrícula', error)
    }
  },

  async cancelarMatricula(id: string, observacoes?: string) {
    try {
      // TODO: Implementar chamada à API
      return null
    } catch (error) {
      throw new AppError('Erro ao cancelar matrícula', error)
    }
  }
} 