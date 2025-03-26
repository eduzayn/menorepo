import { useQuery } from '@tanstack/react-query';
import { useApi } from '@edunexia/api-client';
import { Polo, AlunosPolo, ComissaoPolo, Repasse } from '@edunexia/api-client/src/services/polos';

/**
 * Hook para buscar dados do polo atual
 * @param poloId - ID do polo a ser consultado
 * @returns Dados do polo, alunos, comissões e repasses
 */
export function usePoloData(poloId: string | null) {
  const api = useApi();

  // Busca dados do polo
  const poloQuery = useQuery<Polo, Error>({
    queryKey: ['polo', poloId],
    queryFn: () => api.polos.obterPolo(poloId as string),
    enabled: !!poloId,
  });

  // Busca dados do dashboard do polo
  const dashboardQuery = useQuery<any, Error>({
    queryKey: ['polo', poloId, 'dashboard'],
    queryFn: () => api.polos.obterDashboardPolo(poloId as string),
    enabled: !!poloId,
  });

  // Busca alunos do polo
  const alunosQuery = useQuery<AlunosPolo[], Error>({
    queryKey: ['polo', poloId, 'alunos'],
    queryFn: () => api.polos.listarAlunosPolo(poloId as string),
    enabled: !!poloId,
  });

  // Busca comissões do polo
  const comissoesQuery = useQuery<ComissaoPolo[], Error>({
    queryKey: ['polo', poloId, 'comissoes'],
    queryFn: () => api.polos.listarComissoesPolo(poloId as string),
    enabled: !!poloId,
  });

  // Busca repasses do polo
  const repassesQuery = useQuery<Repasse[], Error>({
    queryKey: ['polo', poloId, 'repasses'],
    queryFn: () => api.polos.listarRepassesPolo(poloId as string),
    enabled: !!poloId,
  });

  return {
    polo: poloQuery.data,
    dashboard: dashboardQuery.data,
    alunos: alunosQuery.data || [],
    comissoes: comissoesQuery.data || [],
    repasses: repassesQuery.data || [],
    isLoading: 
      poloQuery.isLoading || 
      dashboardQuery.isLoading ||
      alunosQuery.isLoading || 
      comissoesQuery.isLoading || 
      repassesQuery.isLoading,
    error: 
      poloQuery.error || 
      dashboardQuery.error ||
      alunosQuery.error || 
      comissoesQuery.error || 
      repassesQuery.error,
    refetch: {
      polo: poloQuery.refetch,
      dashboard: dashboardQuery.refetch,
      alunos: alunosQuery.refetch,
      comissoes: comissoesQuery.refetch,
      repasses: repassesQuery.refetch
    }
  };
} 