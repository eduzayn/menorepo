import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { 
  Automacao, 
  AutomacaoTrigger, 
  AutomacaoAcao, 
  Lead, 
  LeadStatus 
} from '../types/comunicacao';
import { toast } from 'sonner';

interface UseAutomacoesOptions {
  ativoApenas?: boolean;
}

export function useAutomacoes(options: UseAutomacoesOptions = {}) {
  const [automacoes, setAutomacoes] = useState<Automacao[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const { ativoApenas = true } = options;

  useEffect(() => {
    fetchAutomacoes();
  }, [ativoApenas]);

  const fetchAutomacoes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('automacoes')
        .select('*');
        
      if (ativoApenas) {
        query = query.eq('ativo', true);
      }

      const { data, error } = await query;

      if (error) throw new Error(error.message);

      setAutomacoes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar automações'));
      console.error('Erro ao buscar automações:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createAutomacao = async (automacaoData: Omit<Automacao, 'id' | 'criado_at' | 'atualizado_at'>) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('automacoes')
        .insert(automacaoData)
        .select()
        .single();

      if (error) throw new Error(error.message);

      setAutomacoes(prev => [...prev, data]);
      toast.success('Automação criada com sucesso');
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao criar automação'));
      toast.error('Erro ao criar automação');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAutomacao = async (id: string, automacaoData: Partial<Automacao>) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('automacoes')
        .update(automacaoData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      setAutomacoes(prev => prev.map(automacao => automacao.id === id ? data : automacao));
      toast.success('Automação atualizada com sucesso');
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar automação'));
      toast.error('Erro ao atualizar automação');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAutomacao = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('automacoes')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);

      setAutomacoes(prev => prev.filter(automacao => automacao.id !== id));
      toast.success('Automação removida com sucesso');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao remover automação'));
      toast.error('Erro ao remover automação');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAutomacaoStatus = async (id: string, ativo: boolean) => {
    try {
      return await updateAutomacao(id, { ativo });
    } catch (err) {
      console.error('Erro ao alterar status da automação:', err);
      throw err;
    }
  };

  // Verifica se um lead atende às condições de uma automação
  const checkAutomacaoConditions = (automacao: Automacao, lead: Lead): boolean => {
    // Se não houver condições, considera que atende
    if (!automacao.condicoes || Object.keys(automacao.condicoes).length === 0) {
      return true;
    }

    const conditions = automacao.condicoes;

    // Verificar condições de status
    if (conditions.status && lead.status !== conditions.status) {
      return false;
    }

    // Verificar condições de pontuação
    if (conditions.scoreMin !== undefined && (lead.score || 0) < conditions.scoreMin) {
      return false;
    }
    if (conditions.scoreMax !== undefined && (lead.score || 0) > conditions.scoreMax) {
      return false;
    }

    // Verificar condições de origem
    if (conditions.origem && lead.canal_origem !== conditions.origem) {
      return false;
    }

    // Verificar condições de segmento
    if (conditions.segmentos && conditions.segmentos.length > 0) {
      if (!lead.segmento || !conditions.segmentos.some(seg => lead.segmento?.includes(seg))) {
        return false;
      }
    }

    // Verificar condições de tags
    if (conditions.tags && conditions.tags.length > 0) {
      if (!lead.tags || !conditions.tags.some(tag => lead.tags?.includes(tag))) {
        return false;
      }
    }

    // Passar por todas as verificações significa que o lead atende às condições
    return true;
  };

  // Processar um trigger de automação para um lead
  const processarTrigger = async (
    trigger: AutomacaoTrigger, 
    lead: Lead, 
    contexto: Record<string, any> = {}
  ) => {
    try {
      // Buscar automações ativas para este trigger
      const { data: automacoesParaTrigger, error } = await supabase
        .from('automacoes')
        .select('*')
        .eq('trigger', trigger)
        .eq('ativo', true);
      
      if (error) throw error;
      
      if (!automacoesParaTrigger || automacoesParaTrigger.length === 0) {
        return { processed: 0 };
      }
      
      let acoesProcessadas = 0;
      
      // Para cada automação, verificar se o lead atende às condições
      for (const automacao of automacoesParaTrigger) {
        if (checkAutomacaoConditions(automacao, lead)) {
          // Executar as ações da automação
          for (const acao of automacao.acoes) {
            await executarAcao(acao.tipo, lead, acao.parametros, contexto);
            acoesProcessadas++;
            
            // Respeitar intervalo entre ações, se especificado
            if (acao.intervalo && acao.intervalo > 0) {
              await new Promise(resolve => setTimeout(resolve, acao.intervalo * 1000));
            }
          }
          
          // Registrar execução da automação
          await supabase
            .from('automacoes_execucoes')
            .insert({
              automacao_id: automacao.id,
              lead_id: lead.id,
              data_execucao: new Date().toISOString(),
              resultado: 'SUCESSO',
              acoes_executadas: automacao.acoes.length,
              contexto: contexto
            });
        }
      }
      
      return { processed: acoesProcessadas };
    } catch (err) {
      console.error('Erro ao processar trigger de automação:', err);
      return { processed: 0, error: err };
    }
  };

  // Executa uma ação de automação
  const executarAcao = async (
    tipo: AutomacaoAcao, 
    lead: Lead, 
    parametros: Record<string, any>,
    contexto: Record<string, any> = {}
  ) => {
    try {
      switch (tipo) {
        case 'ENVIAR_EMAIL':
          // Implementação de envio de email
          console.log(`Enviando email para ${lead.email} com assunto "${parametros.assunto}"`);
          // Aqui você chamaria seu serviço de email
          return { success: true, message: 'Email enviado com sucesso' };
          
        case 'ENVIAR_SMS':
          // Implementação de envio de SMS
          console.log(`Enviando SMS para ${lead.telefone} com mensagem "${parametros.mensagem}"`);
          // Aqui você chamaria seu serviço de SMS
          return { success: true, message: 'SMS enviado com sucesso' };
          
        case 'ATRIBUIR_RESPONSAVEL':
          // Atribuir responsável ao lead
          const { error: errorResponsavel } = await supabase
            .from('leads')
            .update({ responsavel_id: parametros.responsavel_id })
            .eq('id', lead.id);
            
          if (errorResponsavel) throw errorResponsavel;
          return { success: true, message: 'Responsável atribuído com sucesso' };
          
        case 'MUDAR_STATUS':
          // Mudar status do lead
          const { error: errorStatus } = await supabase
            .from('leads')
            .update({ status: parametros.status })
            .eq('id', lead.id);
            
          if (errorStatus) throw errorStatus;
          return { success: true, message: 'Status alterado com sucesso' };
          
        case 'ADICIONAR_TAREFA':
          // Adicionar tarefa relacionada ao lead
          const { error: errorTarefa } = await supabase
            .from('tarefas')
            .insert({
              titulo: parametros.titulo,
              descricao: parametros.descricao,
              data_vencimento: parametros.data_vencimento,
              prioridade: parametros.prioridade,
              responsavel_id: parametros.responsavel_id,
              lead_id: lead.id,
              status: 'PENDENTE'
            });
            
          if (errorTarefa) throw errorTarefa;
          return { success: true, message: 'Tarefa adicionada com sucesso' };
          
        case 'AGENDAR_REUNIAO':
          // Agendar reunião com o lead
          const { error: errorReuniao } = await supabase
            .from('reunioes')
            .insert({
              lead_id: lead.id,
              titulo: parametros.titulo,
              descricao: parametros.descricao,
              data_inicio: parametros.data_inicio,
              data_fim: parametros.data_fim,
              local: parametros.local,
              link_virtual: parametros.link_virtual,
              responsavel_id: parametros.responsavel_id,
              participantes: parametros.participantes || [lead.id, parametros.responsavel_id]
            });
            
          if (errorReuniao) throw errorReuniao;
          return { success: true, message: 'Reunião agendada com sucesso' };
          
        default:
          return { success: false, message: 'Tipo de ação desconhecido' };
      }
    } catch (err) {
      console.error(`Erro ao executar ação ${tipo}:`, err);
      return { success: false, error: err };
    }
  };

  // Executa manualmente uma automação para um lead específico
  const executarAutomacaoManual = async (automacaoId: string, leadId: string) => {
    try {
      // Buscar a automação
      const { data: automacao, error: automacaoError } = await supabase
        .from('automacoes')
        .select('*')
        .eq('id', automacaoId)
        .single();
        
      if (automacaoError) throw automacaoError;
      
      // Buscar o lead
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();
        
      if (leadError) throw leadError;
      
      // Verificar condições
      if (!checkAutomacaoConditions(automacao, lead)) {
        return { success: false, message: 'Lead não atende às condições da automação' };
      }
      
      // Executar ações
      let acoesProcessadas = 0;
      for (const acao of automacao.acoes) {
        await executarAcao(acao.tipo, lead, acao.parametros);
        acoesProcessadas++;
      }
      
      // Registrar execução
      await supabase
        .from('automacoes_execucoes')
        .insert({
          automacao_id: automacao.id,
          lead_id: lead.id,
          data_execucao: new Date().toISOString(),
          resultado: 'SUCESSO',
          acoes_executadas: acoesProcessadas,
          contexto: { execucao_manual: true }
        });
        
      toast.success('Automação executada com sucesso');
      return { success: true, processed: acoesProcessadas };
    } catch (err) {
      toast.error('Erro ao executar automação');
      console.error('Erro ao executar automação manual:', err);
      return { success: false, error: err };
    }
  };

  return {
    automacoes,
    isLoading,
    error,
    fetchAutomacoes,
    createAutomacao,
    updateAutomacao,
    deleteAutomacao,
    toggleAutomacaoStatus,
    processarTrigger,
    executarAcao,
    executarAutomacaoManual
  };
} 