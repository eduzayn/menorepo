import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { matriculaService } from '../services/matriculaService'
import { MatriculaFilters, SolicitacaoCancelamentoForm, StatusSolicitacaoCancelamento, AnaliseCancelamentoForm } from '../types/matricula'
import { AppError } from '../errors/AppError'

// Chaves para queries de solicitações de cancelamento
export const solicitacaoCancelamentoKeys = {
  all: ['solicitacoes-cancelamento'] as const,
  lists: () => [...solicitacaoCancelamentoKeys.all, 'list'] as const,
  list: (filters: any) => [...solicitacaoCancelamentoKeys.lists(), filters] as const,
  details: () => [...solicitacaoCancelamentoKeys.all, 'detail'] as const,
  detail: (id: string) => [...solicitacaoCancelamentoKeys.details(), id] as const,
}

// Solicitar cancelamento de matrícula
export function useSolicitarCancelamento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ matriculaId, dados }: { matriculaId: string, dados: SolicitacaoCancelamentoForm }) => 
      matriculaService.solicitarCancelamento(matriculaId, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: solicitacaoCancelamentoKeys.lists() })
      toast.success('Solicitação de cancelamento enviada com sucesso')
    },
    onError: (error) => {
      if (error instanceof AppError) {
        toast.error(error.message)
      } else {
        toast.error('Erro ao solicitar cancelamento')
      }
    }
  })
}

// Listar solicitações de cancelamento
export function useListarSolicitacoesCancelamento(
  filtros?: {
    status?: StatusSolicitacaoCancelamento,
    dataInicio?: string,
    dataFim?: string,
    page?: number,
    perPage?: number
  } 
) {
  return useQuery({
    queryKey: solicitacaoCancelamentoKeys.list(filtros),
    queryFn: () => matriculaService.listarSolicitacoesCancelamento(filtros),
    keepPreviousData: true,
  })
}

// Obter detalhes de uma solicitação de cancelamento
export function useObterSolicitacaoCancelamento(id: string) {
  return useQuery({
    queryKey: solicitacaoCancelamentoKeys.detail(id),
    queryFn: () => matriculaService.obterSolicitacaoCancelamento(id),
    enabled: !!id,
  })
}

// Analisar solicitação de cancelamento
export function useAnalisarSolicitacaoCancelamento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, analise }: { id: string, analise: AnaliseCancelamentoForm }) => 
      matriculaService.analisarSolicitacaoCancelamento(id, analise),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: solicitacaoCancelamentoKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: solicitacaoCancelamentoKeys.lists() })
      toast.success('Solicitação de cancelamento analisada com sucesso')
    },
    onError: (error) => {
      if (error instanceof AppError) {
        toast.error(error.message)
      } else {
        toast.error('Erro ao analisar solicitação de cancelamento')
      }
    }
  })
}

// Processar cancelamentos automáticos
export function useProcessarCancelamentosAutomaticos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => matriculaService.processarCancelamentosAutomaticos(),
    onSuccess: (cancelamentosRealizados) => {
      queryClient.invalidateQueries({ queryKey: solicitacaoCancelamentoKeys.lists() })
      if (cancelamentosRealizados > 0) {
        toast.success(`${cancelamentosRealizados} cancelamentos realizados automaticamente`)
      } else {
        toast.success('Nenhum cancelamento automático necessário')
      }
    },
    onError: (error) => {
      if (error instanceof AppError) {
        toast.error(error.message)
      } else {
        toast.error('Erro ao processar cancelamentos automáticos')
      }
    }
  })
} 