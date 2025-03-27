/**
 * Serviço para integração com gateways de pagamento
 * Implementação real da API Lytex
 */

// Tipos de gateways suportados
export type TipoGateway = 'lytex' | 'infinitypay';

// Configuração para Lytex
export interface ConfigLytex {
  apiKey: string;
  merchantId: string;
  ambiente: 'sandbox' | 'producao';
}

// Configuração para InfinityPay (mantida apenas para compatibilidade)
export interface ConfigInfinityPay {
  clientId: string;
  clientSecret: string;
  ambiente: 'sandbox' | 'producao';
}

// União das configurações possíveis
export type ConfigGateway = ConfigLytex | ConfigInfinityPay;

// Interfaces para pagamentos
export interface DadosPagamento {
  valor: number;
  descricao: string;
  referencia: string; // ID da cobrança
  nomeCliente: string;
  emailCliente: string;
  cpfCliente?: string;
  telefoneCliente?: string;
  vencimento: Date;
  notificacaoUrl?: string;
  retornoUrl?: string;
}

// Resultado do processamento de pagamento
export interface ResultadoPagamento {
  sucesso: boolean;
  idTransacao?: string;
  link?: string;
  status?: string;
  codigoQR?: string;
  pixCopiaECola?: string;
  mensagem?: string;
  erro?: any;
}

// Tipos de métodos de pagamento
export type MetodoPagamento = 'pix' | 'boleto' | 'cartao' | 'link';

// Dados para um boleto
export interface DadosBoleto extends DadosPagamento {
  endereco?: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
}

// Dados para pagamento com cartão
export interface DadosCartao extends DadosPagamento {
  cartao: {
    nome: string;
    numero: string;
    validade: string; // MM/AA
    cvv: string;
    parcelas: number;
  };
}

// API Lytex real
class LytexAPI {
  private config: ConfigLytex;
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(config: ConfigLytex) {
    this.config = config;
    this.baseUrl = config.ambiente === 'producao' 
      ? 'https://api.lytex.com.br' 
      : 'https://sandbox.api.lytex.com.br';
    
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
      'X-Merchant-ID': config.merchantId
    };
  }

  private async fazerRequisicao<T>(
    metodo: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    dados?: any
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const opcoes: RequestInit = {
        method: metodo,
        headers: this.headers,
        body: dados ? JSON.stringify(dados) : undefined
      };
      
      const resposta = await fetch(url, opcoes);
      const respostaJson = await resposta.json();
      
      if (!resposta.ok) {
        throw new Error(respostaJson.message || `Erro na requisição: ${resposta.status}`);
      }
      
      return respostaJson as T;
    } catch (error) {
      console.error(`Erro na requisição Lytex (${endpoint}):`, error);
      throw error;
    }
  }

  async gerarPix(dados: DadosPagamento): Promise<ResultadoPagamento> {
    try {
      // Converter os dados para o formato esperado pela API Lytex
      const payload = {
        amount: dados.valor * 100, // Valor em centavos
        description: dados.descricao,
        reference_id: dados.referencia,
        customer: {
          name: dados.nomeCliente,
          email: dados.emailCliente,
          tax_id: dados.cpfCliente, // CPF
          phone: dados.telefoneCliente
        },
        expiration_date: Math.floor(dados.vencimento.getTime() / 1000), // Timestamp UNIX
        notification_url: dados.notificacaoUrl,
        additional_info: {
          source: 'edunexia-platform'
        }
      };

      const resposta = await this.fazerRequisicao<any>('POST', '/v1/payment/pix', payload);
      
      return {
        sucesso: true,
        idTransacao: resposta.id,
        link: resposta.payment_url,
        codigoQR: resposta.qr_code_image,
        pixCopiaECola: resposta.qr_code_plain,
        status: resposta.status
      };
    } catch (error) {
      console.error('Erro ao gerar PIX via Lytex:', error);
      return {
        sucesso: false,
        mensagem: `Falha ao gerar PIX: ${(error as Error).message}`,
        erro: error
      };
    }
  }

  async gerarBoleto(dados: DadosBoleto): Promise<ResultadoPagamento> {
    try {
      // Converter os dados para o formato esperado pela API Lytex
      const payload = {
        amount: dados.valor * 100, // Valor em centavos
        description: dados.descricao,
        reference_id: dados.referencia,
        customer: {
          name: dados.nomeCliente,
          email: dados.emailCliente,
          tax_id: dados.cpfCliente, // CPF
          phone: dados.telefoneCliente,
          address: dados.endereco ? {
            zip_code: dados.endereco.cep,
            street: dados.endereco.logradouro,
            number: dados.endereco.numero,
            complement: dados.endereco.complemento,
            neighborhood: dados.endereco.bairro,
            city: dados.endereco.cidade,
            state: dados.endereco.estado,
            country: 'BR'
          } : undefined
        },
        due_date: Math.floor(dados.vencimento.getTime() / 1000), // Timestamp UNIX
        notification_url: dados.notificacaoUrl,
        instructions: `Ref: ${dados.referencia}`,
        additional_info: {
          source: 'edunexia-platform'
        }
      };

      const resposta = await this.fazerRequisicao<any>('POST', '/v1/payment/boleto', payload);
      
      return {
        sucesso: true,
        idTransacao: resposta.id,
        link: resposta.payment_url,
        status: resposta.status
      };
    } catch (error) {
      console.error('Erro ao gerar boleto via Lytex:', error);
      return {
        sucesso: false,
        mensagem: `Falha ao gerar boleto: ${(error as Error).message}`,
        erro: error
      };
    }
  }

  async gerarLinkPagamento(dados: DadosPagamento): Promise<ResultadoPagamento> {
    try {
      // Converter os dados para o formato esperado pela API Lytex
      const payload = {
        amount: dados.valor * 100, // Valor em centavos
        description: dados.descricao,
        reference_id: dados.referencia,
        customer: {
          name: dados.nomeCliente,
          email: dados.emailCliente,
          tax_id: dados.cpfCliente
        },
        expiration_date: Math.floor(dados.vencimento.getTime() / 1000), // Timestamp UNIX
        redirect_url: dados.retornoUrl,
        notification_url: dados.notificacaoUrl,
        payment_methods: ['pix', 'boleto', 'credit_card'],
        additional_info: {
          source: 'edunexia-platform'
        }
      };

      const resposta = await this.fazerRequisicao<any>('POST', '/v1/payment/checkout', payload);
      
      return {
        sucesso: true,
        idTransacao: resposta.id,
        link: resposta.checkout_url,
        status: resposta.status
      };
    } catch (error) {
      console.error('Erro ao gerar link de pagamento via Lytex:', error);
      return {
        sucesso: false,
        mensagem: `Falha ao gerar link de pagamento: ${(error as Error).message}`,
        erro: error
      };
    }
  }

  async verificarStatus(idTransacao: string): Promise<ResultadoPagamento> {
    try {
      const resposta = await this.fazerRequisicao<any>('GET', `/v1/payment/${idTransacao}`);
      
      // Mapear o status da API Lytex para o nosso padrão
      let statusMapeado: string;
      switch(resposta.status) {
        case 'pending':
          statusMapeado = 'pendente';
          break;
        case 'approved':
        case 'paid':
          statusMapeado = 'pago';
          break;
        case 'canceled':
          statusMapeado = 'cancelado';
          break;
        case 'expired':
          statusMapeado = 'vencido';
          break;
        default:
          statusMapeado = resposta.status;
      }
      
      return {
        sucesso: true,
        idTransacao: resposta.id,
        status: statusMapeado
      };
    } catch (error) {
      console.error(`Erro ao verificar status da transação ${idTransacao} via Lytex:`, error);
      return {
        sucesso: false,
        mensagem: `Falha ao verificar status: ${(error as Error).message}`,
        erro: error
      };
    }
  }

  async reembolsar(idTransacao: string, motivo: string): Promise<ResultadoPagamento> {
    try {
      const payload = {
        reason: motivo
      };

      const resposta = await this.fazerRequisicao<any>('POST', `/v1/payment/${idTransacao}/refund`, payload);
      
      return {
        sucesso: true,
        idTransacao: resposta.id,
        status: resposta.status
      };
    } catch (error) {
      console.error(`Erro ao reembolsar transação ${idTransacao} via Lytex:`, error);
      return {
        sucesso: false,
        mensagem: `Falha ao reembolsar: ${(error as Error).message}`,
        erro: error
      };
    }
  }
}

// Mock API InfinityPay (mantida apenas para compatibilidade)
class InfinityPayAPI {
  // ... Código original ... 
  private config: ConfigInfinityPay;

  constructor(config: ConfigInfinityPay) {
    this.config = config;
    console.warn('InfinityPay está temporariamente desativado. Usando apenas Lytex.');
  }

  async criarPix(dados: DadosPagamento): Promise<ResultadoPagamento> {
    return {
      sucesso: false,
      mensagem: 'InfinityPay está temporariamente desativado. Use o gateway Lytex.'
    };
  }

  async criarBoleto(dados: DadosBoleto): Promise<ResultadoPagamento> {
    return {
      sucesso: false,
      mensagem: 'InfinityPay está temporariamente desativado. Use o gateway Lytex.'
    };
  }

  async criarLinkPagamento(dados: DadosPagamento): Promise<ResultadoPagamento> {
    return {
      sucesso: false,
      mensagem: 'InfinityPay está temporariamente desativado. Use o gateway Lytex.'
    };
  }

  async consultarTransacao(idTransacao: string): Promise<ResultadoPagamento> {
    return {
      sucesso: false,
      mensagem: 'InfinityPay está temporariamente desativado. Use o gateway Lytex.'
    };
  }
}

// Classe principal para gerenciamento de gateways
export class GatewayPagamentoService {
  private gatewayPadrao: TipoGateway;
  private configLytex?: ConfigLytex;
  private configInfinityPay?: ConfigInfinityPay;
  private lytexAPI?: LytexAPI;
  private infinityPayAPI?: InfinityPayAPI;
  private webhookHandlers: Map<string, (data: any) => Promise<void>> = new Map();

  constructor(gatewayPadrao: TipoGateway, config: ConfigGateway) {
    // Forçar uso do Lytex enquanto InfinityPay está desativado
    this.gatewayPadrao = 'lytex';
    
    // Configurar o gateway baseado no tipo
    if ('merchantId' in config) {
      this.configLytex = config;
      this.lytexAPI = new LytexAPI(config);
    } else if ('clientId' in config) {
      // Avisar sobre InfinityPay desativado e configurar Lytex se disponível
      console.warn('InfinityPay está temporariamente desativado. Uso do Lytex será forçado.');
      
      // Se não houver configuração do Lytex, lançar erro
      throw new Error('Configuração do Lytex obrigatória. InfinityPay está temporariamente desativado.');
    } else {
      throw new Error('Configuração inválida para o gateway de pagamento');
    }
  }

  // Configura um webhook handler para receber notificações de pagamentos
  registrarWebhookHandler(tipo: 'pagamento' | 'reembolso' | 'erro', handler: (data: any) => Promise<void>): void {
    this.webhookHandlers.set(tipo, handler);
  }

  // Processa webhook recebido do gateway
  async processarWebhook(payload: any, assinatura?: string): Promise<boolean> {
    try {
      // Validar assinatura (se fornecida)
      if (assinatura && this.configLytex) {
        // Implementar a validação da assinatura do webhook conforme documentação da Lytex
        // Se inválido, retornar false
      }
      
      // Determinar o tipo de evento
      const tipoEvento = payload.event;
      
      switch(tipoEvento) {
        case 'payment.approved':
        case 'payment.paid':
          const handlerPagamento = this.webhookHandlers.get('pagamento');
          if (handlerPagamento) {
            await handlerPagamento(payload);
          }
          break;
        case 'payment.refunded':
          const handlerReembolso = this.webhookHandlers.get('reembolso');
          if (handlerReembolso) {
            await handlerReembolso(payload);
          }
          break;
        case 'payment.failed':
          const handlerErro = this.webhookHandlers.get('erro');
          if (handlerErro) {
            await handlerErro(payload);
          }
          break;
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      return false;
    }
  }

  // Determina o gateway com base no ID da transação
  private determinarGatewayPorIdTransacao(idTransacao: string): TipoGateway {
    // No momento, forçamos o uso do Lytex
    return 'lytex';
  }

  // Gera PIX
  async gerarPix(dados: DadosPagamento, gateway?: TipoGateway): Promise<ResultadoPagamento> {
    try {
      if (this.lytexAPI) {
        return await this.lytexAPI.gerarPix(dados);
      }
      
      throw new Error('Gateway Lytex não está configurado');
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      return {
        sucesso: false,
        mensagem: `Falha ao gerar PIX: ${(error as Error).message}`,
        erro: error
      };
    }
  }

  // Gera Boleto
  async gerarBoleto(dados: DadosBoleto, gateway?: TipoGateway): Promise<ResultadoPagamento> {
    try {
      if (this.lytexAPI) {
        return await this.lytexAPI.gerarBoleto(dados);
      }
      
      throw new Error('Gateway Lytex não está configurado');
    } catch (error) {
      console.error('Erro ao gerar boleto:', error);
      return {
        sucesso: false,
        mensagem: `Falha ao gerar boleto: ${(error as Error).message}`,
        erro: error
      };
    }
  }

  // Gera link de pagamento
  async gerarLinkPagamento(dados: DadosPagamento, gateway?: TipoGateway): Promise<ResultadoPagamento> {
    try {
      if (this.lytexAPI) {
        return await this.lytexAPI.gerarLinkPagamento(dados);
      }
      
      throw new Error('Gateway Lytex não está configurado');
    } catch (error) {
      console.error('Erro ao gerar link de pagamento:', error);
      return {
        sucesso: false,
        mensagem: `Falha ao gerar link de pagamento: ${(error as Error).message}`,
        erro: error
      };
    }
  }

  // Verifica status de uma transação
  async verificarStatusTransacao(idTransacao: string, gateway?: TipoGateway): Promise<ResultadoPagamento> {
    try {
      if (this.lytexAPI) {
        return await this.lytexAPI.verificarStatus(idTransacao);
      }
      
      throw new Error('Gateway Lytex não está configurado');
    } catch (error) {
      console.error(`Erro ao verificar status da transação ${idTransacao}:`, error);
      return {
        sucesso: false,
        mensagem: `Falha ao verificar status: ${(error as Error).message}`,
        erro: error
      };
    }
  }

  // Reembolsa uma transação
  async reembolsarTransacao(idTransacao: string, motivo: string, gateway?: TipoGateway): Promise<ResultadoPagamento> {
    try {
      if (this.lytexAPI) {
        return await this.lytexAPI.reembolsar(idTransacao, motivo);
      }
      
      throw new Error('Gateway Lytex não está configurado');
    } catch (error) {
      console.error(`Erro ao reembolsar transação ${idTransacao}:`, error);
      return {
        sucesso: false,
        mensagem: `Falha ao reembolsar: ${(error as Error).message}`,
        erro: error
      };
    }
  }
} 