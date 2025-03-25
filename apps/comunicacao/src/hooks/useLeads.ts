import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Lead } from '@/types/comunicacao';
import { supabase } from '@/lib/supabase';

async function fetchLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('criado_at', { ascending: false });

  if (error) throw error;
  return data;
}

async function updateLead(leadId: string, updates: Partial<Lead>): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', leadId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function useLeads() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['leads'],
    queryFn: fetchLeads,
  });

  const updateMutation = useMutation({
    mutationFn: ({ leadId, updates }: { leadId: string; updates: Partial<Lead> }) =>
      updateLead(leadId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const updateLeadStatus = async (leadId: string, newStatus: Lead['status']) => {
    await updateMutation.mutateAsync({
      leadId,
      updates: { status: newStatus },
    });
  };

  return {
    data,
    isLoading,
    error,
    updateLeadStatus,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
} 