import { getGatewayConfig, validarConfigGateway } from '../config/pagamentos';
import axios from 'axios';

/**
 * Interface para criar uma cobrança no Lytex
 */
export interface CriarCobrancaLytexParams {
  aluno: {
    id: string;
    nome: string;
    email: string;
    cpf: string;
    telefone?: string;
  };
  valor: number;
  descricao: string;
  referencia: string; // ID da matrícula ou cobrança no sistema
  vencimento: Date;
  metodosPagamento?: Array<'pix' | 'boleto' | 'cartao'>;
  maxParcelas?: number;
  urlRetorno?: string;
}

/**
 * Interface de resposta ao criar uma cobrança no Lytex
 */
export interface CobrancaLytexResponse {
  id: string;
  status: string;
  valor: number;
  linkPagamento: string;
  dataCriacao: string;
  dataVencimento: string;
  pixCopiaECola?: string;
  qrCodeImage?: string;
  linhaDigitavel?: string;
  pdf?: string;
}

/**
 * Classe para integração com o gateway de pagamentos Lytex
 */
class LytexService {
  private config = getGatewayConfig('lytex');
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  /**
   * Verifica se a configuração do Lytex está válida
   */
  public isConfigValid(): boolean {
    return validarConfigGateway('lytex');
  }

  /**
   * Verifica se o token está expirado
   */
  private isTokenExpired(): boolean {
    if (!this.token || !this.tokenExpiry) return true;
    return new Date() > this.tokenExpiry;
  }

  /**
   * Obtém um token de acesso para a API do Lytex
   */
  private async getAccessToken(): Promise<string> {
    if (this.token && !this.isTokenExpired()) {
      return this.token;
    }

    try {
      const response = await axios.post(
        `${this.config.baseUrl}/oauth/token`,
        {
          grant_type: 'client_credentials',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      this.token = response.data.access_token;
      // Define a expiração para 1 hora antes do tempo real (margem de segurança)
      const expiresIn = response.data.expires_in || 3600;
      this.tokenExpiry = new Date(Date.now() + (expiresIn - 3600) * 1000);

      if (!this.token) {
        throw new Error('Token não recebido da API Lytex');
      }

      return this.token;
    } catch (error) {
      console.error('Erro ao obter token de acesso Lytex:', error);
      throw new Error('Falha ao autenticar no gateway Lytex');
    }
  }

  /**
   * Cria uma nova cobrança no Lytex
   */
  public async criarCobranca(params: CriarCobrancaLytexParams): Promise<CobrancaLytexResponse> {
    if (!this.isConfigValid()) {
      throw new Error('Configuração do Lytex inválida ou incompleta');
    }

    try {
      const token = await this.getAccessToken();

      const payload = {
        valor: params.valor,
        descricao: params.descricao,
        referencia: params.referencia,
        vencimento: params.vencimento.toISOString().split('T')[0], // formato YYYY-MM-DD
        cliente: {
          nome: params.aluno.nome,
          email: params.aluno.email,
          cpf: params.aluno.cpf,
          telefone: params.aluno.telefone || '',
        },
        metodosPagamento: params.metodosPagamento || ['pix', 'boleto', 'cartao'],
        maxParcelas: params.maxParcelas || 12,
        urlRetorno: params.urlRetorno || this.config.callbackUrl,
        callbackUrl: this.config.callbackUrl,
      };

      const response = await axios.post(
        `${this.config.baseUrl}/api/v1/cobrancas`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        id: response.data.id,
        status: response.data.status,
        valor: response.data.valor,
        linkPagamento: response.data.link_pagamento,
        dataCriacao: response.data.data_criacao,
        dataVencimento: response.data.data_vencimento,
        pixCopiaECola: response.data.pix_copia_e_cola,
        qrCodeImage: response.data.qrcode_image,
        linhaDigitavel: response.data.linha_digitavel,
        pdf: response.data.pdf_url,
      };
    } catch (error) {
      console.error('Erro ao criar cobrança no Lytex:', error);
      throw new Error('Falha ao criar cobrança no gateway Lytex');
    }
  }

  /**
   * Consulta o status de uma cobrança no Lytex
   */
  public async consultarCobranca(cobrancaId: string): Promise<CobrancaLytexResponse> {
    if (!this.isConfigValid()) {
      throw new Error('Configuração do Lytex inválida ou incompleta');
    }

    try {
      const token = await this.getAccessToken();

      const response = await axios.get(
        `${this.config.baseUrl}/api/v1/cobrancas/${cobrancaId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        id: response.data.id,
        status: response.data.status,
        valor: response.data.valor,
        linkPagamento: response.data.link_pagamento,
        dataCriacao: response.data.data_criacao,
        dataVencimento: response.data.data_vencimento,
        pixCopiaECola: response.data.pix_copia_e_cola,
        qrCodeImage: response.data.qrcode_image,
        linhaDigitavel: response.data.linha_digitavel,
        pdf: response.data.pdf_url,
      };
    } catch (error) {
      console.error('Erro ao consultar cobrança no Lytex:', error);
      throw new Error('Falha ao consultar cobrança no gateway Lytex');
    }
  }

  /**
   * Cancela uma cobrança no Lytex
   */
  public async cancelarCobranca(cobrancaId: string): Promise<{ success: boolean; message: string }> {
    if (!this.isConfigValid()) {
      throw new Error('Configuração do Lytex inválida ou incompleta');
    }

    try {
      const token = await this.getAccessToken();

      await axios.delete(
        `${this.config.baseUrl}/api/v1/cobrancas/${cobrancaId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        message: 'Cobrança cancelada com sucesso',
      };
    } catch (error) {
      console.error('Erro ao cancelar cobrança no Lytex:', error);
      throw new Error('Falha ao cancelar cobrança no gateway Lytex');
    }
  }
}

// Exporta uma instância única do serviço
export const lytexService = new LytexService(); 