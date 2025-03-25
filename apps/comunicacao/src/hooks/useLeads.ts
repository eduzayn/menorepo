import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Lead, LeadStatus } from '@/types/comunicacao';
import {
  buscarLeads,
  buscarLead,
  criarLead,
  atualizarLead,
  deletarLead
} from '@/services/leads';

interface UseLeadsOptions {
  busca?: string;
  status?: LeadStatus;
  pagina?: number;
  porPagina?: number;
  ordenarPor?: 'criado_at' | 'atualizado_at' | 'ultima_interacao';
  ordem?: 'asc' | 'desc';
}

export function useLeads(options: UseLeadsOptions = {}) {
  const queryClient = useQueryClient();
  const queryKey = ['leads', options];

  const { data: leads = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: () => buscarLeads(options),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const { mutateAsync: criar } = useMutation({
    mutationFn: criarLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const { mutateAsync: atualizar } = useMutation({
    mutationFn: ({ id, lead }: { id: string; lead: Parameters<typeof atualizarLead>[1] }) =>
      atualizarLead(id, lead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const { mutateAsync: deletar } = useMutation({
    mutationFn: deletarLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  return {
    leads,
    isLoading,
    error,
    criar,
    atualizar,
    deletar,
  };
}

export function useLead(id: string) {
  const queryClient = useQueryClient();
  const queryKey = ['lead', id];

  const { data: lead, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => buscarLead(id),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const { mutateAsync: atualizar } = useMutation({
    mutationFn: (leadData: Parameters<typeof atualizarLead>[1]) => atualizarLead(id, leadData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const { mutateAsync: deletar } = useMutation({
    mutationFn: () => deletarLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  return {
    lead,
    isLoading,
    error,
    atualizar,
    deletar,
  };
} 