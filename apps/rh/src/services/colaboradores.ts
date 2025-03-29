import { ApiClient } from '@edunexia/api-client';
import { 
  Colaborador,
  TipoContrato,
  ApiResponse 
} from '../types';

/**
 * Serviço para gerenciamento de colaboradores
 */
export class ColaboradoresService {
  private api: ApiClient;
  private baseUrl = '/rh/colaboradores';

  constructor(apiClient: ApiClient) {
    this.api = apiClient;
  }

  /**
   * Lista colaboradores com opções de filtro
   */
  async listarColaboradores(filtros?: {
    departamento?: string,
    cargo?: string,
    ativo?: boolean,
    termo_busca?: string
  }): Promise<ApiResponse<Colaborador[]>> {
    return this.api.get(this.baseUrl, { params: filtros });
  }

  /**
   * Obtém detalhes de um colaborador específico
   */
  async obterColaborador(id: string): Promise<ApiResponse<Colaborador>> {
    return this.api.get(`${this.baseUrl}/${id}`);
  }

  /**
   * Cadastra um novo colaborador
   */
  async cadastrarColaborador(colaborador: Omit<Colaborador, 'id'>): Promise<ApiResponse<Colaborador>> {
    return this.api.post(this.baseUrl, colaborador);
  }

  /**
   * Atualiza dados de um colaborador
   */
  async atualizarColaborador(id: string, dados: Partial<Colaborador>): Promise<ApiResponse<Colaborador>> {
    return this.api.put(`${this.baseUrl}/${id}`, dados);
  }

  /**
   * Altera o status de atividade de um colaborador (ativo/inativo)
   */
  async alterarStatusAtividade(id: string, ativo: boolean, motivo?: string): Promise<ApiResponse<Colaborador>> {
    return this.api.patch(`${this.baseUrl}/${id}/status-atividade`, { ativo, motivo });
  }

  /**
   * Atualiza contrato de um colaborador
   */
  async atualizarContrato(id: string, dados: {
    tipo_contrato: TipoContrato,
    data_inicio: string,
    data_fim?: string,
    salario: number,
    beneficios: Array<{ nome: string, valor: number }>,
    carga_horaria_semanal: number
  }): Promise<ApiResponse<Colaborador>> {
    return this.api.put(`${this.baseUrl}/${id}/contrato`, dados);
  }

  /**
   * Registra férias de um colaborador
   */
  async registrarFerias(id: string, dados: {
    data_inicio: string,
    data_fim: string,
    observacoes?: string
  }): Promise<ApiResponse<{ id_ferias: string }>> {
    return this.api.post(`${this.baseUrl}/${id}/ferias`, dados);
  }

  /**
   * Registra afastamento de um colaborador
   */
  async registrarAfastamento(id: string, dados: {
    data_inicio: string,
    data_fim?: string,
    motivo: string,
    tipo: 'SAUDE' | 'LICENCA' | 'OUTRO',
    observacoes?: string
  }): Promise<ApiResponse<{ id_afastamento: string }>> {
    return this.api.post(`${this.baseUrl}/${id}/afastamento`, dados);
  }

  /**
   * Registra histórico de cargo/promoção
   */
  async registrarHistoricoCargo(id: string, dados: {
    cargo_anterior: string,
    cargo_novo: string,
    data_alteracao: string,
    motivo: string,
    ajuste_salarial?: number
  }): Promise<ApiResponse<{ id_historico: string }>> {
    return this.api.post(`${this.baseUrl}/${id}/historico-cargo`, dados);
  }

  /**
   * Obtém documentos de um colaborador
   */
  async listarDocumentos(id: string): Promise<ApiResponse<Array<{
    id: string,
    nome: string,
    tipo: string,
    data_upload: string,
    url: string
  }>>> {
    return this.api.get(`${this.baseUrl}/${id}/documentos`);
  }

  /**
   * Obtém estatísticas de colaboradores
   */
  async obterEstatisticas(): Promise<ApiResponse<{
    total: number,
    ativos: number,
    inativos: number,
    por_departamento: Record<string, number>,
    por_tipo_contrato: Record<TipoContrato, number>
  }>> {
    return this.api.get(`${this.baseUrl}/estatisticas`);
  }
} 