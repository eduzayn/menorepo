import { ApiClient } from '@edunexia/api-client';
import { 
  SocialMediaConfig, 
  Vaga, 
  Candidato, 
  ApiResponse 
} from '../types';

/**
 * Serviço para integração com redes sociais no módulo RH
 */
export class SocialMediaService {
  private api: ApiClient;
  private baseUrl = '/rh/social';

  constructor(apiClient: ApiClient) {
    this.api = apiClient;
  }

  /**
   * Obtém configurações de integração com redes sociais
   */
  async getConfigurations(): Promise<ApiResponse<SocialMediaConfig[]>> {
    return this.api.get(`${this.baseUrl}/config`);
  }

  /**
   * Atualiza configurações de uma rede social
   */
  async updateConfiguration(config: SocialMediaConfig): Promise<ApiResponse<SocialMediaConfig>> {
    return this.api.put(`${this.baseUrl}/config/${config.id}`, config);
  }

  /**
   * Publica uma vaga nas redes sociais configuradas
   */
  async publishJobToSocialMedia(vagaId: string, redeSocial?: string): Promise<ApiResponse<{ success: boolean }>> {
    const endpoint = redeSocial 
      ? `${this.baseUrl}/publicar/${vagaId}/${redeSocial}`
      : `${this.baseUrl}/publicar/${vagaId}`;
    
    return this.api.post(endpoint, {});
  }

  /**
   * Importa dados de candidato do LinkedIn
   */
  async importCandidateFromLinkedIn(profileUrl: string): Promise<ApiResponse<Candidato>> {
    return this.api.post(`${this.baseUrl}/import/linkedin`, { profileUrl });
  }

  /**
   * Sincroniza vagas com plataformas externas
   */
  async syncJobsWithExternalPlatforms(): Promise<ApiResponse<{ updatedJobs: number }>> {
    return this.api.post(`${this.baseUrl}/sync/vagas`, {});
  }

  /**
   * Obtém métricas de desempenho de publicações de vagas
   */
  async getJobPostMetrics(vagaId: string): Promise<ApiResponse<any>> {
    return this.api.get(`${this.baseUrl}/metricas/${vagaId}`);
  }
} 