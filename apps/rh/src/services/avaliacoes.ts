import { ApiClient } from '@edunexia/api-client';
import { 
  Avaliacao,
  Meta,
  CompetenciaAvaliada,
  ApiResponse 
} from '../types';

/**
 * Serviço para gestão de avaliações de desempenho
 */
export class AvaliacoesService {
  private api: ApiClient;
  private baseUrl = '/rh/avaliacoes';

  constructor(apiClient: ApiClient) {
    this.api = apiClient;
  }

  /**
   * Lista avaliações com opções de filtro
   */
  async listarAvaliacoes(filtros?: {
    colaborador_id?: string,
    departamento?: string,
    periodo?: string,
    finalizada?: boolean
  }): Promise<ApiResponse<Avaliacao[]>> {
    return this.api.get(this.baseUrl, { params: filtros });
  }

  /**
   * Obtém detalhes de uma avaliação específica
   */
  async obterAvaliacao(id: string): Promise<ApiResponse<Avaliacao>> {
    return this.api.get(`${this.baseUrl}/${id}`);
  }

  /**
   * Cria uma nova avaliação
   */
  async criarAvaliacao(avaliacao: Omit<Avaliacao, 'id'>): Promise<ApiResponse<Avaliacao>> {
    return this.api.post(this.baseUrl, avaliacao);
  }

  /**
   * Atualiza dados de uma avaliação
   */
  async atualizarAvaliacao(id: string, dados: Partial<Avaliacao>): Promise<ApiResponse<Avaliacao>> {
    return this.api.put(`${this.baseUrl}/${id}`, dados);
  }

  /**
   * Finaliza uma avaliação
   */
  async finalizarAvaliacao(id: string, dados: {
    nota_final: number,
    observacoes_finais: string,
    plano_desenvolvimento?: string
  }): Promise<ApiResponse<Avaliacao>> {
    return this.api.patch(`${this.baseUrl}/${id}/finalizar`, dados);
  }

  /**
   * Remove uma avaliação
   */
  async removerAvaliacao(id: string): Promise<ApiResponse<void>> {
    return this.api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Lista metas de uma avaliação
   */
  async listarMetas(avaliacaoId: string): Promise<ApiResponse<Meta[]>> {
    return this.api.get(`${this.baseUrl}/${avaliacaoId}/metas`);
  }

  /**
   * Adiciona meta a uma avaliação
   */
  async adicionarMeta(avaliacaoId: string, meta: Omit<Meta, 'id'>): Promise<ApiResponse<Meta>> {
    return this.api.post(`${this.baseUrl}/${avaliacaoId}/metas`, meta);
  }

  /**
   * Atualiza progresso de uma meta
   */
  async atualizarProgressoMeta(avaliacaoId: string, metaId: string, dados: {
    progresso: number,
    observacoes?: string
  }): Promise<ApiResponse<Meta>> {
    return this.api.patch(`${this.baseUrl}/${avaliacaoId}/metas/${metaId}/progresso`, dados);
  }

  /**
   * Lista competências avaliadas
   */
  async listarCompetencias(avaliacaoId: string): Promise<ApiResponse<CompetenciaAvaliada[]>> {
    return this.api.get(`${this.baseUrl}/${avaliacaoId}/competencias`);
  }

  /**
   * Avalia uma competência
   */
  async avaliarCompetencia(avaliacaoId: string, competenciaId: string, dados: {
    nota: number,
    observacoes: string
  }): Promise<ApiResponse<CompetenciaAvaliada>> {
    return this.api.patch(`${this.baseUrl}/${avaliacaoId}/competencias/${competenciaId}`, dados);
  }

  /**
   * Gera relatório de avaliação
   */
  async gerarRelatorio(avaliacaoId: string, formato: 'PDF' | 'EXCEL' = 'PDF'): Promise<ApiResponse<{
    url: string,
    expira_em: string
  }>> {
    return this.api.get(`${this.baseUrl}/${avaliacaoId}/relatorio`, { params: { formato } });
  }

  /**
   * Obtém estatísticas de avaliações
   */
  async obterEstatisticas(filtros?: {
    departamento?: string,
    periodo?: string
  }): Promise<ApiResponse<{
    total: number,
    media_geral: number,
    por_departamento: Record<string, { total: number, media: number }>,
    distribuicao_notas: Record<string, number>
  }>> {
    return this.api.get(`${this.baseUrl}/estatisticas`, { params: filtros });
  }
} 