import { ApiClient } from '@edunexia/api-client';
import { 
  Vaga, 
  EtapaProcesso,
  StatusVaga,
  ApiResponse 
} from '../types';

/**
 * Serviço para gerenciamento de vagas
 */
export class VagasService {
  private api: ApiClient;
  private baseUrl = '/rh/vagas';

  constructor(apiClient: ApiClient) {
    this.api = apiClient;
  }

  /**
   * Lista todas as vagas com opções de filtro
   */
  async listarVagas(filtros?: {
    status?: StatusVaga,
    departamento?: string,
    data_inicio?: string,
    data_fim?: string
  }): Promise<ApiResponse<Vaga[]>> {
    return this.api.get(this.baseUrl, { params: filtros });
  }

  /**
   * Obtém detalhes de uma vaga específica
   */
  async obterVaga(id: string): Promise<ApiResponse<Vaga>> {
    return this.api.get(`${this.baseUrl}/${id}`);
  }

  /**
   * Cria uma nova vaga
   */
  async criarVaga(vaga: Omit<Vaga, 'id'>): Promise<ApiResponse<Vaga>> {
    return this.api.post(this.baseUrl, vaga);
  }

  /**
   * Atualiza dados de uma vaga existente
   */
  async atualizarVaga(id: string, dados: Partial<Vaga>): Promise<ApiResponse<Vaga>> {
    return this.api.put(`${this.baseUrl}/${id}`, dados);
  }

  /**
   * Altera o status de uma vaga
   */
  async alterarStatusVaga(id: string, status: StatusVaga): Promise<ApiResponse<Vaga>> {
    return this.api.patch(`${this.baseUrl}/${id}/status`, { status });
  }

  /**
   * Remove uma vaga
   */
  async removerVaga(id: string): Promise<ApiResponse<void>> {
    return this.api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Lista etapas do processo seletivo de uma vaga
   */
  async listarEtapasProcesso(vagaId: string): Promise<ApiResponse<EtapaProcesso[]>> {
    return this.api.get(`${this.baseUrl}/${vagaId}/etapas`);
  }

  /**
   * Adiciona uma etapa ao processo seletivo
   */
  async adicionarEtapaProcesso(vagaId: string, etapa: Omit<EtapaProcesso, 'id'>): Promise<ApiResponse<EtapaProcesso>> {
    return this.api.post(`${this.baseUrl}/${vagaId}/etapas`, etapa);
  }

  /**
   * Remove uma etapa do processo seletivo
   */
  async removerEtapaProcesso(vagaId: string, etapaId: string): Promise<ApiResponse<void>> {
    return this.api.delete(`${this.baseUrl}/${vagaId}/etapas/${etapaId}`);
  }

  /**
   * Obtém estatísticas de vagas
   */
  async obterEstatisticas(): Promise<ApiResponse<{
    total: number,
    abertas: number,
    em_andamento: number,
    encerradas: number,
    por_departamento: Record<string, number>
  }>> {
    return this.api.get(`${this.baseUrl}/estatisticas`);
  }
} 