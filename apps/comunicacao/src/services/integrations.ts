import { supabase } from './supabase';
import { enviarPorCanal } from './comunicacao';
import type { ComunicacaoCanal } from '../types/comunicacao';
import type {
  NotificacaoPortalAluno,
  NotificacaoMatricula,
  NotificacaoFinanceiro,
  NotificacaoResponse,
  PreferenciasNotificacao
} from '../types/integrations';

// Serviço de integrações
export class IntegrationsService {
  // Portal do Aluno
  async notificarPortalAluno(notificacao: NotificacaoPortalAluno): Promise<NotificacaoResponse> {
    try {
      // 1. Buscar preferências de notificação do aluno
      const { data: aluno } = await supabase
        .from('alunos')
        .select('email, telefone, push_token, preferencias_notificacao')
        .eq('id', notificacao.aluno_id)
        .single();

      if (!aluno) throw new Error('Aluno não encontrado');

      // 2. Determinar canais de notificação baseado nas preferências
      const canais: ComunicacaoCanal[] = [];
      const preferencias = (aluno.preferencias_notificacao || {}) as PreferenciasNotificacao;

      if (preferencias.email) canais.push('EMAIL');
      if (preferencias.sms) canais.push('SMS');
      if (preferencias.push) canais.push('PUSH');

      // 3. Enviar notificações por cada canal
      const resultados: NotificacaoResponse[] = [];
      for (const canal of canais) {
        let destinatarios: string[] = [];
        switch (canal) {
          case 'EMAIL':
            destinatarios = [aluno.email];
            break;
          case 'SMS':
            destinatarios = [aluno.telefone];
            break;
          case 'PUSH':
            if (aluno.push_token) {
              destinatarios = [aluno.push_token];
            }
            break;
        }

        if (destinatarios.length > 0) {
          const resultado = await enviarPorCanal(
            destinatarios,
            notificacao.conteudo,
            notificacao.titulo,
            canal
          );
          resultados.push({
            success: resultado.success,
            messageId: resultado.messageId,
            error: resultado.error,
            canaisUtilizados: [canal]
          });
        }
      }

      // 4. Registrar notificação no banco
      await supabase.from('notificacoes_portal').insert({
        aluno_id: notificacao.aluno_id,
        tipo: notificacao.tipo,
        titulo: notificacao.titulo,
        conteudo: notificacao.conteudo,
        curso_id: notificacao.curso_id,
        disciplina_id: notificacao.disciplina_id,
        data: notificacao.data || new Date().toISOString(),
        link: notificacao.link
      });

      // 5. Retornar resultado consolidado
      return {
        success: resultados.every(r => r.success),
        messageId: resultados.map(r => r.messageId).filter(Boolean).join(','),
        error: resultados.find(r => r.error)?.error,
        canaisUtilizados: canais
      };
    } catch (error) {
      console.error('Erro ao enviar notificação do Portal do Aluno:', error);
      throw error;
    }
  }

  // Matrícula
  async notificarMatricula(notificacao: NotificacaoMatricula): Promise<NotificacaoResponse> {
    try {
      // 1. Buscar dados do aluno
      const { data: aluno } = await supabase
        .from('alunos')
        .select('email, telefone, push_token, preferencias_notificacao')
        .eq('id', notificacao.aluno_id)
        .single();

      if (!aluno) throw new Error('Aluno não encontrado');

      // 2. Determinar canais de notificação
      const canais: ComunicacaoCanal[] = [];
      const preferencias = (aluno.preferencias_notificacao || {}) as PreferenciasNotificacao;

      if (preferencias.email) canais.push('EMAIL');
      if (preferencias.sms) canais.push('SMS');
      if (preferencias.push) canais.push('PUSH');

      // 3. Enviar notificações
      const resultados: NotificacaoResponse[] = [];
      for (const canal of canais) {
        let destinatarios: string[] = [];
        switch (canal) {
          case 'EMAIL':
            destinatarios = [aluno.email];
            break;
          case 'SMS':
            destinatarios = [aluno.telefone];
            break;
          case 'PUSH':
            if (aluno.push_token) {
              destinatarios = [aluno.push_token];
            }
            break;
        }

        if (destinatarios.length > 0) {
          const resultado = await enviarPorCanal(
            destinatarios,
            notificacao.conteudo,
            notificacao.titulo,
            canal
          );
          resultados.push({
            success: resultado.success,
            messageId: resultado.messageId,
            error: resultado.error,
            canaisUtilizados: [canal]
          });
        }
      }

      // 4. Registrar notificação
      await supabase.from('notificacoes_matricula').insert({
        aluno_id: notificacao.aluno_id,
        matricula_id: notificacao.matricula_id,
        tipo: notificacao.tipo,
        titulo: notificacao.titulo,
        conteudo: notificacao.conteudo,
        prazo: notificacao.prazo,
        documentos_pendentes: notificacao.documentos_pendentes,
        link: notificacao.link
      });

      // 5. Retornar resultado consolidado
      return {
        success: resultados.every(r => r.success),
        messageId: resultados.map(r => r.messageId).filter(Boolean).join(','),
        error: resultados.find(r => r.error)?.error,
        canaisUtilizados: canais
      };
    } catch (error) {
      console.error('Erro ao enviar notificação de Matrícula:', error);
      throw error;
    }
  }

  // Financeiro
  async notificarFinanceiro(notificacao: NotificacaoFinanceiro): Promise<NotificacaoResponse> {
    try {
      // 1. Buscar dados do aluno
      const { data: aluno } = await supabase
        .from('alunos')
        .select('email, telefone, push_token, preferencias_notificacao')
        .eq('id', notificacao.aluno_id)
        .single();

      if (!aluno) throw new Error('Aluno não encontrado');

      // 2. Determinar canais de notificação
      const canais: ComunicacaoCanal[] = [];
      const preferencias = (aluno.preferencias_notificacao || {}) as PreferenciasNotificacao;

      if (preferencias.email) canais.push('EMAIL');
      if (preferencias.sms) canais.push('SMS');
      if (preferencias.push) canais.push('PUSH');

      // 3. Enviar notificações
      const resultados: NotificacaoResponse[] = [];
      for (const canal of canais) {
        let destinatarios: string[] = [];
        switch (canal) {
          case 'EMAIL':
            destinatarios = [aluno.email];
            break;
          case 'SMS':
            destinatarios = [aluno.telefone];
            break;
          case 'PUSH':
            if (aluno.push_token) {
              destinatarios = [aluno.push_token];
            }
            break;
        }

        if (destinatarios.length > 0) {
          const resultado = await enviarPorCanal(
            destinatarios,
            notificacao.conteudo,
            notificacao.titulo,
            canal
          );
          resultados.push({
            success: resultado.success,
            messageId: resultado.messageId,
            error: resultado.error,
            canaisUtilizados: [canal]
          });
        }
      }

      // 4. Registrar notificação
      await supabase.from('notificacoes_financeiro').insert({
        aluno_id: notificacao.aluno_id,
        tipo: notificacao.tipo,
        titulo: notificacao.titulo,
        conteudo: notificacao.conteudo,
        valor: notificacao.valor,
        vencimento: notificacao.vencimento,
        link: notificacao.link
      });

      // 5. Retornar resultado consolidado
      return {
        success: resultados.every(r => r.success),
        messageId: resultados.map(r => r.messageId).filter(Boolean).join(','),
        error: resultados.find(r => r.error)?.error,
        canaisUtilizados: canais
      };
    } catch (error) {
      console.error('Erro ao enviar notificação Financeira:', error);
      throw error;
    }
  }
}

// Exportar instância do serviço
export const integrationsService = new IntegrationsService(); 