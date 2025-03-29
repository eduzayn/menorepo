import { ApiResponse } from '@edunexia/shared-types';
import { Avaliacao, NovaAvaliacao, StatusAvaliacao } from '@edunexia/shared-types/rh';
import { SupabaseClient } from '@supabase/supabase-js';

export class AvaliacoesService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Lista todas as avaliações com paginação e filtros
   */
  async listarAvaliacoes(
    pagina = 1, 
    itensPorPagina = 10, 
    termoBusca = '', 
    status?: StatusAvaliacao, 
    colaboradorId?: string,
    dataInicio?: string,
    dataFim?: string
  ): Promise<ApiResponse<Avaliacao[]>> {
    try {
      // Calculando o offset com base na página
      const offset = (pagina - 1) * itensPorPagina;
      
      // Iniciando a query
      let query = this.supabase
        .from('avaliacoes')
        .select('*, colaborador:colaborador_id(*), avaliador:avaliador_id(*)', { count: 'exact' });
      
      // Adicionando filtros se fornecidos
      if (termoBusca) {
        query = query.or(
          `ciclo_avaliativo.ilike.%${termoBusca}%,` +
          `colaborador.nome.ilike.%${termoBusca}%,` +
          `avaliador.nome.ilike.%${termoBusca}%`
        );
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (colaboradorId) {
        query = query.eq('colaborador_id', colaboradorId);
      }
      
      if (dataInicio) {
        query = query.gte('data_inicio', dataInicio);
      }
      
      if (dataFim) {
        query = query.lte('data_fim', dataFim);
      }
      
      // Executando a consulta principal
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + itensPorPagina - 1);
      
      if (error) throw error;
      
      return {
        items: data as unknown as Avaliacao[],
        total: count || 0,
        pagina,
        itensPorPagina
      };
    } catch (error) {
      console.error('[AvaliacoesService] Erro ao listar avaliações:', error);
      throw error;
    }
  }

  /**
   * Obtém os dados de uma avaliação específica
   */
  async obterAvaliacao(id: string): Promise<Avaliacao> {
    try {
      const { data, error } = await this.supabase
        .from('avaliacoes')
        .select('*, colaborador:colaborador_id(*), avaliador:avaliador_id(*), metas(*), competencias(*)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as unknown as Avaliacao;
    } catch (error) {
      console.error(`[AvaliacoesService] Erro ao obter avaliação ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtém avaliações pendentes para um avaliador
   */
  async obterAvaliacoesPendentes(avaliadorId: string): Promise<Avaliacao[]> {
    try {
      const { data, error } = await this.supabase
        .from('avaliacoes')
        .select('*, colaborador:colaborador_id(*)')
        .eq('avaliador_id', avaliadorId)
        .in('status', [StatusAvaliacao.PENDENTE, StatusAvaliacao.EM_ANDAMENTO])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data as unknown as Avaliacao[];
    } catch (error) {
      console.error(`[AvaliacoesService] Erro ao obter avaliações pendentes para avaliador ${avaliadorId}:`, error);
      throw error;
    }
  }

  /**
   * Cadastra uma nova avaliação
   */
  async cadastrarAvaliacao(avaliacao: NovaAvaliacao): Promise<Avaliacao> {
    try {
      // Inicia uma transação
      const { data: avaliacaoData, error: avaliacaoError } = await this.supabase
        .from('avaliacoes')
        .insert([{
          ciclo_avaliativo: avaliacao.ciclo_avaliativo,
          colaborador_id: avaliacao.colaborador_id,
          avaliador_id: avaliacao.avaliador_id,
          data_inicio: avaliacao.data_inicio,
          data_fim: avaliacao.data_fim,
          status: StatusAvaliacao.PENDENTE,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (avaliacaoError) throw avaliacaoError;
      
      // Se houver metas, insere-as
      if (avaliacao.metas && avaliacao.metas.length > 0) {
        const metasComId = avaliacao.metas.map(meta => ({
          ...meta,
          avaliacao_id: avaliacaoData.id,
          created_at: new Date().toISOString()
        }));
        
        const { error: metasError } = await this.supabase
          .from('metas')
          .insert(metasComId);
          
        if (metasError) throw metasError;
      }
      
      // Se houver competências, insere-as
      if (avaliacao.competencias && avaliacao.competencias.length > 0) {
        const competenciasComId = avaliacao.competencias.map(competencia => ({
          ...competencia,
          avaliacao_id: avaliacaoData.id,
          created_at: new Date().toISOString()
        }));
        
        const { error: competenciasError } = await this.supabase
          .from('competencias')
          .insert(competenciasComId);
          
        if (competenciasError) throw competenciasError;
      }
      
      return await this.obterAvaliacao(avaliacaoData.id);
    } catch (error) {
      console.error('[AvaliacoesService] Erro ao cadastrar avaliação:', error);
      throw error;
    }
  }

  /**
   * Atualiza os dados de uma avaliação
   */
  async atualizarAvaliacao(id: string, avaliacao: Partial<Avaliacao>): Promise<Avaliacao> {
    try {
      const { data, error } = await this.supabase
        .from('avaliacoes')
        .update({
          ...avaliacao,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Avaliacao;
    } catch (error) {
      console.error(`[AvaliacoesService] Erro ao atualizar avaliação ${id}:`, error);
      throw error;
    }
  }

  /**
   * Altera o status de uma avaliação
   */
  async alterarStatusAvaliacao(id: string, status: StatusAvaliacao): Promise<Avaliacao> {
    try {
      const { data, error } = await this.supabase
        .from('avaliacoes')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Avaliacao;
    } catch (error) {
      console.error(`[AvaliacoesService] Erro ao alterar status da avaliação ${id}:`, error);
      throw error;
    }
  }

  /**
   * Conclui uma avaliação, adicionando feedback e nota final
   */
  async concluirAvaliacao(
    id: string, 
    notaFinal: number, 
    feedback: string
  ): Promise<Avaliacao> {
    try {
      const { data, error } = await this.supabase
        .from('avaliacoes')
        .update({
          nota_final: notaFinal,
          feedback,
          status: StatusAvaliacao.CONCLUIDA,
          data_conclusao: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Avaliacao;
    } catch (error) {
      console.error(`[AvaliacoesService] Erro ao concluir avaliação ${id}:`, error);
      throw error;
    }
  }

  /**
   * Exclui uma avaliação
   */
  async excluirAvaliacao(id: string): Promise<void> {
    try {
      // Excluir registros relacionados primeiro
      const { error: metasError } = await this.supabase
        .from('metas')
        .delete()
        .eq('avaliacao_id', id);
      
      if (metasError) throw metasError;
      
      const { error: competenciasError } = await this.supabase
        .from('competencias')
        .delete()
        .eq('avaliacao_id', id);
      
      if (competenciasError) throw competenciasError;
      
      // Exclui a avaliação
      const { error } = await this.supabase
        .from('avaliacoes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`[AvaliacoesService] Erro ao excluir avaliação ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas sobre as avaliações
   */
  async obterEstatisticas(): Promise<{ 
    total: number; 
    pendentes: number; 
    emAndamento: number; 
    concluidas: number;
    mediaNotas: number;
  }> {
    try {
      // Obtém o total de avaliações
      const { count: total, error: totalError } = await this.supabase
        .from('avaliacoes')
        .select('*', { count: 'exact', head: true });
        
      if (totalError) throw totalError;
      
      // Obtém o total de avaliações pendentes
      const { count: pendentes, error: pendentesError } = await this.supabase
        .from('avaliacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', StatusAvaliacao.PENDENTE);
        
      if (pendentesError) throw pendentesError;
      
      // Obtém o total de avaliações em andamento
      const { count: emAndamento, error: emAndamentoError } = await this.supabase
        .from('avaliacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', StatusAvaliacao.EM_ANDAMENTO);
        
      if (emAndamentoError) throw emAndamentoError;
      
      // Obtém o total de avaliações concluídas
      const { count: concluidas, error: concluidasError } = await this.supabase
        .from('avaliacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', StatusAvaliacao.CONCLUIDA);
        
      if (concluidasError) throw concluidasError;
      
      // Obtém a média de notas das avaliações concluídas
      const { data: avaliacoesConcluidas, error: notasError } = await this.supabase
        .from('avaliacoes')
        .select('nota_final')
        .eq('status', StatusAvaliacao.CONCLUIDA)
        .not('nota_final', 'is', null);
        
      if (notasError) throw notasError;
      
      let mediaNotas = 0;
      if (avaliacoesConcluidas.length > 0) {
        const somaNotas = avaliacoesConcluidas.reduce((soma, av) => soma + (av.nota_final || 0), 0);
        mediaNotas = somaNotas / avaliacoesConcluidas.length;
      }
      
      return {
        total: total || 0,
        pendentes: pendentes || 0,
        emAndamento: emAndamento || 0,
        concluidas: concluidas || 0,
        mediaNotas
      };
    } catch (error) {
      console.error('[AvaliacoesService] Erro ao obter estatísticas:', error);
      throw error;
    }
  }
} 