import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { matriculaService, matriculaKeys, type MatriculaFilters } from '../services/matriculaService'
import { toast } from 'sonner'
import { AppError } from '../lib/errors'

export function useMatriculas(filters?: MatriculaFilters) {
  return useQuery({
    queryKey: matriculaKeys.list(filters || {}),
    queryFn: () => matriculaService.listarMatriculas(filters),
  })
}

export function useMatricula(id: string) {
  return useQuery({
    queryKey: matriculaKeys.detail(id),
    queryFn: () => matriculaService.buscarMatricula(id),
    enabled: !!id
  })
}

export function useCriarMatricula() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: matriculaService.criarMatricula,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matriculaKeys.lists() })
      toast.success('Matrícula criada com sucesso')
    },
    onError: (error) => {
      if (error instanceof AppError) {
        toast.error(error.message)
      } else {
        toast.error('Erro ao criar matrícula')
      }
    }
  })
}

export function useAtualizarMatricula() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Parameters<typeof matriculaService.atualizarMatricula>[1] }) => 
      matriculaService.atualizarMatricula(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: matriculaKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: matriculaKeys.lists() })
      toast.success('Matrícula atualizada com sucesso')
    },
    onError: (error) => {
      if (error instanceof AppError) {
        toast.error(error.message)
      } else {
        toast.error('Erro ao atualizar matrícula')
      }
    }
  })
}

export function useCancelarMatricula() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, observacoes }: { id: string, observacoes?: string }) => 
      matriculaService.cancelarMatricula(id, observacoes),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: matriculaKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: matriculaKeys.lists() })
      toast.success('Matrícula cancelada com sucesso')
    },
    onError: (error) => {
      if (error instanceof AppError) {
        toast.error(error.message)
      } else {
        toast.error('Erro ao cancelar matrícula')
      }
    }
  })
} 