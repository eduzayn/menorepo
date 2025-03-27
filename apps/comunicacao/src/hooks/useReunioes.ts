import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Reuniao, Lead } from '../types/comunicacao';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

interface UseReunioesOptions {
  leadId?: string;
  periodo?: {
    inicio: string;
    fim: string;
  };
}

export function useReunioes(options: UseReunioesOptions = {}) {
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const { leadId, periodo } = options;

  useEffect(() => {
    fetchReunioes();
  }, [leadId, periodo]);

  const fetchReunioes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('reunioes')
        .select('*, leads(nome, email, telefone)');

      // Filtrar por lead, se especificado
      if (leadId) {
        query = query.eq('lead_id', leadId);
      } else if (user?.id) {
        // Se não especificar lead, mostrar apenas as reuniões em que o usuário é responsável
        // ou está como participante
        query = query.or(`responsavel_id.eq.${user.id},participantes.cs.{${user.id}}`);
      }

      // Filtrar por período, se especificado
      if (periodo) {
        query = query
          .gte('data_inicio', periodo.inicio)
          .lte('data_inicio', periodo.fim);
      }

      const { data, error } = await query;

      if (error) throw new Error(error.message);

      setReunioes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar reuniões'));
      console.error('Erro ao buscar reuniões:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createReuniao = async (reuniaoData: Omit<Reuniao, 'id' | 'criado_at' | 'atualizado_at'>) => {
    try {
      setIsLoading(true);
      setError(null);

      // Adicionar o usuário atual como responsável, se não especificado
      if (!reuniaoData.responsavel_id && user?.id) {
        reuniaoData.responsavel_id = user.id;
      }

      // Garantir que o responsável está na lista de participantes
      if (!reuniaoData.participantes.includes(reuniaoData.responsavel_id)) {
        reuniaoData.participantes = [...reuniaoData.participantes, reuniaoData.responsavel_id];
      }

      const { data, error } = await supabase
        .from('reunioes')
        .insert(reuniaoData)
        .select()
        .single();

      if (error) throw new Error(error.message);

      setReunioes(prev => [...prev, data]);
      
      // Criar evento no calendário, se integração estiver disponível
      if (window.gtag) {
        window.gtag('event', 'reuniao_criada', {
          lead_id: reuniaoData.lead_id,
          titulo: reuniaoData.titulo,
          data: reuniaoData.data_inicio
        });
      }
      
      toast.success('Reunião agendada com sucesso');
      
      // Enviar notificações para os participantes
      await enviarNotificacoesReuniao(data);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao agendar reunião'));
      toast.error('Erro ao agendar reunião');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateReuniao = async (id: string, reuniaoData: Partial<Reuniao>) => {
    try {
      setIsLoading(true);
      setError(null);

      // Se estiver atualizando os participantes, garantir que o responsável está incluído
      if (reuniaoData.participantes && reuniaoData.responsavel_id) {
        if (!reuniaoData.participantes.includes(reuniaoData.responsavel_id)) {
          reuniaoData.participantes = [...reuniaoData.participantes, reuniaoData.responsavel_id];
        }
      }

      const { data, error } = await supabase
        .from('reunioes')
        .update(reuniaoData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      setReunioes(prev => prev.map(reuniao => reuniao.id === id ? data : reuniao));
      
      toast.success('Reunião atualizada com sucesso');
      
      // Enviar notificações para os participantes sobre a atualização
      await enviarNotificacoesReuniao(data, 'atualizar');
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar reunião'));
      toast.error('Erro ao atualizar reunião');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReuniao = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Buscar informações da reunião antes de excluir (para notificações)
      const { data: reuniao } = await supabase
        .from('reunioes')
        .select('*')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('reunioes')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);

      setReunioes(prev => prev.filter(reuniao => reuniao.id !== id));
      toast.success('Reunião cancelada com sucesso');
      
      // Enviar notificações para os participantes sobre o cancelamento
      if (reuniao) {
        await enviarNotificacoesReuniao(reuniao, 'cancelar');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao cancelar reunião'));
      toast.error('Erro ao cancelar reunião');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Enviar notificações sobre a reunião para todos os participantes
  const enviarNotificacoesReuniao = async (reuniao: Reuniao, tipo: 'criar' | 'atualizar' | 'cancelar' = 'criar') => {
    try {
      // Buscar informações dos participantes (para ter acesso a emails e telefones)
      const { data: participantesInfo, error } = await supabase
        .from('usuarios')
        .select('id, nome, email, preferencias_notificacao')
        .in('id', reuniao.participantes);
        
      if (error || !participantesInfo) {
        console.error('Erro ao buscar informações dos participantes:', error);
        return;
      }
      
      // Preparar mensagens baseadas no tipo de notificação
      let assunto = '';
      let mensagem = '';
      
      switch (tipo) {
        case 'criar':
          assunto = `Nova reunião: ${reuniao.titulo}`;
          mensagem = `Uma nova reunião foi agendada: ${reuniao.titulo} em ${new Date(reuniao.data_inicio).toLocaleString()}`;
          break;
        case 'atualizar':
          assunto = `Reunião atualizada: ${reuniao.titulo}`;
          mensagem = `A reunião "${reuniao.titulo}" foi atualizada para ${new Date(reuniao.data_inicio).toLocaleString()}`;
          break;
        case 'cancelar':
          assunto = `Reunião cancelada: ${reuniao.titulo}`;
          mensagem = `A reunião "${reuniao.titulo}" agendada para ${new Date(reuniao.data_inicio).toLocaleString()} foi cancelada`;
          break;
      }
      
      // Para cada participante, enviar notificação conforme suas preferências
      for (const participante of participantesInfo) {
        // Verificar preferências de notificação
        const preferencias = participante.preferencias_notificacao || { email: true, sistema: true };
        
        if (preferencias.email) {
          // Aqui seria integrado com o serviço de email
          console.log(`Enviando email para ${participante.email}: ${assunto}`);
        }
        
        if (preferencias.sistema) {
          // Criar notificação no sistema
          await supabase.from('notificacoes').insert({
            usuario_id: participante.id,
            tipo: 'reuniao',
            titulo: assunto,
            conteudo: mensagem,
            data: new Date().toISOString(),
            lida: false,
            link: `/reunioes/${reuniao.id}`
          });
        }
      }
    } catch (err) {
      console.error('Erro ao enviar notificações da reunião:', err);
    }
  };

  // Obter disponibilidade de horários para reuniões
  const getDisponibilidade = async (data: string, responsavelId?: string) => {
    try {
      // Buscar reuniões na data especificada
      const inicio = new Date(data);
      inicio.setHours(0, 0, 0, 0);
      
      const fim = new Date(data);
      fim.setHours(23, 59, 59, 999);
      
      let query = supabase
        .from('reunioes')
        .select('data_inicio, data_fim')
        .gte('data_inicio', inicio.toISOString())
        .lte('data_inicio', fim.toISOString());
        
      if (responsavelId) {
        query = query.eq('responsavel_id', responsavelId);
      } else if (user?.id) {
        query = query.eq('responsavel_id', user.id);
      }
      
      const { data: reunioesNaData, error } = await query;
      
      if (error) throw error;
      
      // Horário comercial padrão: 9h às 18h, intervalos de 30 minutos
      const horarioInicio = 9; // 9:00
      const horarioFim = 18; // 18:00
      const intervaloMinutos = 30;
      
      // Gerar todos os slots disponíveis
      const slots = [];
      const dataBase = new Date(data);
      
      for (let hora = horarioInicio; hora < horarioFim; hora++) {
        for (let minuto = 0; minuto < 60; minuto += intervaloMinutos) {
          dataBase.setHours(hora, minuto, 0, 0);
          
          // Verificar se o slot está disponível
          const horarioOcupado = reunioesNaData?.some(reuniao => {
            const inicioReuniao = new Date(reuniao.data_inicio);
            const fimReuniao = new Date(reuniao.data_fim);
            
            return (
              (dataBase >= inicioReuniao && dataBase < fimReuniao) ||
              (new Date(dataBase.getTime() + intervaloMinutos * 60000) > inicioReuniao && 
               new Date(dataBase.getTime() + intervaloMinutos * 60000) <= fimReuniao)
            );
          });
          
          if (!horarioOcupado) {
            slots.push({
              inicio: new Date(dataBase),
              fim: new Date(dataBase.getTime() + intervaloMinutos * 60000)
            });
          }
        }
      }
      
      return slots;
    } catch (err) {
      console.error('Erro ao buscar disponibilidade:', err);
      return [];
    }
  };

  return {
    reunioes,
    isLoading,
    error,
    fetchReunioes,
    createReuniao,
    updateReuniao,
    deleteReuniao,
    getDisponibilidade
  };
} 