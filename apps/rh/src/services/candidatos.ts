import { ApiClient } from '@edunexia/api-client';
import { 
  Candidato,
  StatusCandidato,
  Formacao,
  Experiencia,
  ApiResponse 
} from '../types';

/**
 * Serviço para gerenciamento de candidatos
 */
export class CandidatosService {
  private api: ApiClient;
  private baseUrl = '/rh/candidatos';

  constructor(apiClient: ApiClient) {
    this.api = apiClient;
  }

  /**
   * Lista candidatos com opções de filtro
   */
  async listarCandidatos(filtros?: {
    vaga_id?: string,
    status?: StatusCandidato,
    termo_busca?: string
  }): Promise<ApiResponse<Candidato[]>> {
    return this.api.get(this.baseUrl, { params: filtros });
  }

  /**
   * Obtém detalhes de um candidato específico
   */
  async obterCandidato(id: string): Promise<ApiResponse<Candidato>> {
    return this.api.get(`${this.baseUrl}/${id}`);
  }

  /**
   * Cadastra um novo candidato
   */
  async cadastrarCandidato(candidato: Omit<Candidato, 'id'>): Promise<ApiResponse<Candidato>> {
    return this.api.post(this.baseUrl, candidato);
  }

  /**
   * Atualiza dados de um candidato
   */
  async atualizarCandidato(id: string, dados: Partial<Candidato>): Promise<ApiResponse<Candidato>> {
    return this.api.put(`${this.baseUrl}/${id}`, dados);
  }

  /**
   * Altera o status de um candidato
   */
  async alterarStatusCandidato(id: string, status: StatusCandidato, observacao?: string): Promise<ApiResponse<Candidato>> {
    return this.api.patch(`${this.baseUrl}/${id}/status`, { status, observacao });
  }

  /**
   * Remove um candidato
   */
  async removerCandidato(id: string): Promise<ApiResponse<void>> {
    return this.api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Lista formações acadêmicas de um candidato
   */
  async listarFormacoes(candidatoId: string): Promise<ApiResponse<Formacao[]>> {
    return this.api.get(`${this.baseUrl}/${candidatoId}/formacoes`);
  }

  /**
   * Adiciona formação acadêmica a um candidato
   */
  async adicionarFormacao(candidatoId: string, formacao: Omit<Formacao, 'id'>): Promise<ApiResponse<Formacao>> {
    return this.api.post(`${this.baseUrl}/${candidatoId}/formacoes`, formacao);
  }

  /**
   * Lista experiências profissionais de um candidato
   */
  async listarExperiencias(candidatoId: string): Promise<ApiResponse<Experiencia[]>> {
    return this.api.get(`${this.baseUrl}/${candidatoId}/experiencias`);
  }

  /**
   * Adiciona experiência profissional a um candidato
   */
  async adicionarExperiencia(candidatoId: string, experiencia: Omit<Experiencia, 'id'>): Promise<ApiResponse<Experiencia>> {
    return this.api.post(`${this.baseUrl}/${candidatoId}/experiencias`, experiencia);
  }

  /**
   * Envia email para um candidato
   */
  async enviarEmail(candidatoId: string, dados: {
    assunto: string,
    corpo: string,
    anexos?: Array<{ nome: string, url: string }>
  }): Promise<ApiResponse<{ enviado: boolean }>> {
    return this.api.post(`${this.baseUrl}/${candidatoId}/comunicacao/email`, dados);
  }

  /**
   * Agenda entrevista com candidato
   */
  async agendarEntrevista(candidatoId: string, dados: {
    data: string,
    hora: string,
    tipo: 'PRESENCIAL' | 'REMOTO',
    local?: string,
    link_reuniao?: string,
    entrevistadores: string[]
  }): Promise<ApiResponse<{ agendado: boolean, id_entrevista: string }>> {
    return this.api.post(`${this.baseUrl}/${candidatoId}/agendar-entrevista`, dados);
  }
} 