/**
 * Serviço para integração com gateways de pagamento
 * Suporta Lytex e InfinityPay, permitindo escolha entre os dois
 */

// Tipos de gateways suportados
export type TipoGateway = 'lytex' | 'infinitypay';

// Configuração para Lytex
export interface ConfigLytex {
  apiKey: string;
  merchantId: string;
  ambiente: 'sandbox' | 'producao';
}

// Configuração para InfinityPay
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

// Mock API Lytex (simulação)
class LytexAPI {
  private config: ConfigLytex;

  constructor(config: ConfigLytex) {
    this.config = config;
  }

  async gerarPix(dados: DadosPagamento): Promise<ResultadoPagamento> {
    // Simulação de chamada à API
    console.log('[Lytex] Gerando PIX para', dados.referencia);
    
    // Gerar uma resposta simulada
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      sucesso: true,
      idTransacao: `LYT-PIX-${Math.floor(Math.random() * 1000000)}`,
      link: `https://pag.lytex.com.br/pix/${dados.referencia}`,
      codigoQR: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...',
      pixCopiaECola: '00020101021226930014br.gov.bcb.pix2571pix.example.com/9d36b84f-c70b...',
      status: 'gerado'
    };
  }

  async gerarBoleto(dados: DadosBoleto): Promise<ResultadoPagamento> {
    // Simulação de chamada à API
    console.log('[Lytex] Gerando boleto para', dados.referencia);
    
    // Gerar uma resposta simulada
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      sucesso: true,
      idTransacao: `LYT-BOL-${Math.floor(Math.random() * 1000000)}`,
      link: `https://pag.lytex.com.br/boleto/${dados.referencia}`,
      status: 'emitido'
    };
  }

  async gerarLinkPagamento(dados: DadosPagamento): Promise<ResultadoPagamento> {
    // Simulação de chamada à API
    console.log('[Lytex] Gerando link de pagamento para', dados.referencia);
    
    // Gerar uma resposta simulada
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      sucesso: true,
      idTransacao: `LYT-LINK-${Math.floor(Math.random() * 1000000)}`,
      link: `https://pag.lytex.com.br/checkout/${dados.referencia}`,
      status: 'ativo'
    };
  }

  async verificarStatus(idTransacao: string): Promise<ResultadoPagamento> {
    // Simulação de chamada à API
    console.log('[Lytex] Verificando status da transação', idTransacao);
    
    // Gerar uma resposta simulada
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Aleatoriamente seleciona um status
    const statusPossiveis = ['pendente', 'pago', 'cancelado', 'expirado'];
    const status = statusPossiveis[Math.floor(Math.random() * statusPossiveis.length)];
    
    return {
      sucesso: true,
      idTransacao,
      status
    };
  }
}

// Mock API InfinityPay (simulação)
class InfinityPayAPI {
  private config: ConfigInfinityPay;

  constructor(config: ConfigInfinityPay) {
    this.config = config;
  }

  async criarPix(dados: DadosPagamento): Promise<ResultadoPagamento> {
    // Simulação de chamada à API
    console.log('[InfinityPay] Criando PIX para', dados.referencia);
    
    // Gerar uma resposta simulada
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return {
      sucesso: true,
      idTransacao: `INF-PIX-${Math.floor(Math.random() * 1000000)}`,
      link: `https://pay.infinitypay.io/pix/${dados.referencia}`,
      codigoQR: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...',
      pixCopiaECola: '00020101021226930014br.gov.bcb.pix2571pix.infinitypay.io/q75b4f-c70b...',
      status: 'created'
    };
  }

  async criarBoleto(dados: DadosBoleto): Promise<ResultadoPagamento> {
    // Simulação de chamada à API
    console.log('[InfinityPay] Criando boleto para', dados.referencia);
    
    // Gerar uma resposta simulada
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      sucesso: true,
      idTransacao: `INF-BOL-${Math.floor(Math.random() * 1000000)}`,
      link: `https://pay.infinitypay.io/boleto/${dados.referencia}`,
      status: 'pending'
    };
  }

  async criarLinkPagamento(dados: DadosPagamento): Promise<ResultadoPagamento> {
    // Simulação de chamada à API
    console.log('[InfinityPay] Criando link de pagamento para', dados.referencia);
    
    // Gerar uma resposta simulada
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      sucesso: true,
      idTransacao: `INF-LINK-${Math.floor(Math.random() * 1000000)}`,
      link: `https://pay.infinitypay.io/checkout/${dados.referencia}`,
      status: 'active'
    };
  }

  async consultarTransacao(idTransacao: string): Promise<ResultadoPagamento> {
    // Simulação de chamada à API
    console.log('[InfinityPay] Consultando transação', idTransacao);
    
    // Gerar uma resposta simulada
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Aleatoriamente seleciona um status
    const statusPossiveis = ['pending', 'paid', 'canceled', 'expired'];
    const status = statusPossiveis[Math.floor(Math.random() * statusPossiveis.length)];
    
    return {
      sucesso: true,
      idTransacao,
      status
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

  constructor(gatewayPadrao: TipoGateway, config: ConfigGateway) {
    this.gatewayPadrao = gatewayPadrao;
    
    // Configurar o gateway baseado no tipo
    if (gatewayPadrao === 'lytex' && 'merchantId' in config) {
      this.configLytex = config;
      this.lytexAPI = new LytexAPI(config);
    } else if (gatewayPadrao === 'infinitypay' && 'clientId' in config) {
      this.configInfinityPay = config;
      this.infinityPayAPI = new InfinityPayAPI(config);
    } else {
      throw new Error('Configuração inválida para o gateway de pagamento');
    }
  }

  // Configura um gateway adicional
  configurarGatewayAdicional(tipo: TipoGateway, config: ConfigGateway): void {
    if (tipo === 'lytex' && 'merchantId' in config) {
      this.configLytex = config;
      this.lytexAPI = new LytexAPI(config);
    } else if (tipo === 'infinitypay' && 'clientId' in config) {
      this.configInfinityPay = config;
      this.infinityPayAPI = new InfinityPayAPI(config);
    } else {
      throw new Error('Configuração inválida para o gateway adicional');
    }
  }

  // Define o gateway padrão
  setGatewayPadrao(tipo: TipoGateway): void {
    if ((tipo === 'lytex' && !this.lytexAPI) || 
        (tipo === 'infinitypay' && !this.infinityPayAPI)) {
      throw new Error(`Gateway ${tipo} não está configurado`);
    }
    this.gatewayPadrao = tipo;
  }

  // Gera pagamento PIX
  async gerarPix(dados: DadosPagamento, gateway?: TipoGateway): Promise<ResultadoPagamento> {
    const tipoGateway = gateway || this.gatewayPadrao;
    
    try {
      if (tipoGateway === 'lytex' && this.lytexAPI) {
        return await this.lytexAPI.gerarPix(dados);
      } else if (tipoGateway === 'infinitypay' && this.infinityPayAPI) {
        return await this.infinityPayAPI.criarPix(dados);
      }
      
      throw new Error(`Gateway ${tipoGateway} não está configurado`);
    } catch (error) {
      console.error(`Erro ao gerar PIX via ${tipoGateway}:`, error);
      return {
        sucesso: false,
        mensagem: `Falha ao gerar PIX via ${tipoGateway}`,
        erro: error
      };
    }
  }

  // Gera boleto
  async gerarBoleto(dados: DadosBoleto, gateway?: TipoGateway): Promise<ResultadoPagamento> {
    const tipoGateway = gateway || this.gatewayPadrao;
    
    try {
      if (tipoGateway === 'lytex' && this.lytexAPI) {
        return await this.lytexAPI.gerarBoleto(dados);
      } else if (tipoGateway === 'infinitypay' && this.infinityPayAPI) {
        return await this.infinityPayAPI.criarBoleto(dados);
      }
      
      throw new Error(`Gateway ${tipoGateway} não está configurado`);
    } catch (error) {
      console.error(`Erro ao gerar boleto via ${tipoGateway}:`, error);
      return {
        sucesso: false,
        mensagem: `Falha ao gerar boleto via ${tipoGateway}`,
        erro: error
      };
    }
  }

  // Gera link de pagamento
  async gerarLinkPagamento(dados: DadosPagamento, gateway?: TipoGateway): Promise<ResultadoPagamento> {
    const tipoGateway = gateway || this.gatewayPadrao;
    
    try {
      if (tipoGateway === 'lytex' && this.lytexAPI) {
        return await this.lytexAPI.gerarLinkPagamento(dados);
      } else if (tipoGateway === 'infinitypay' && this.infinityPayAPI) {
        return await this.infinityPayAPI.criarLinkPagamento(dados);
      }
      
      throw new Error(`Gateway ${tipoGateway} não está configurado`);
    } catch (error) {
      console.error(`Erro ao gerar link de pagamento via ${tipoGateway}:`, error);
      return {
        sucesso: false,
        mensagem: `Falha ao gerar link de pagamento via ${tipoGateway}`,
        erro: error
      };
    }
  }

  // Verifica status de uma transação
  async verificarStatusTransacao(idTransacao: string, gateway?: TipoGateway): Promise<ResultadoPagamento> {
    const tipoGateway = gateway || this.determinarGatewayPorIdTransacao(idTransacao);
    
    try {
      if (tipoGateway === 'lytex' && this.lytexAPI) {
        return await this.lytexAPI.verificarStatus(idTransacao);
      } else if (tipoGateway === 'infinitypay' && this.infinityPayAPI) {
        return await this.infinityPayAPI.consultarTransacao(idTransacao);
      }
      
      throw new Error(`Gateway ${tipoGateway} não está configurado`);
    } catch (error) {
      console.error(`Erro ao verificar status da transação ${idTransacao} via ${tipoGateway}:`, error);
      return {
        sucesso: false,
        mensagem: `Falha ao verificar status da transação ${idTransacao}`,
        erro: error
      };
    }
  }

  // Determina o gateway com base no ID da transação
  private determinarGatewayPorIdTransacao(idTransacao: string): TipoGateway {
    if (idTransacao.startsWith('LYT-')) {
      return 'lytex';
    } else if (idTransacao.startsWith('INF-')) {
      return 'infinitypay';
    }
    
    // Se não conseguir determinar, usa o padrão
    return this.gatewayPadrao;
  }

  // Traduz status do gateway para um formato padronizado
  traduzirStatus(status: string, gateway: TipoGateway): 'pendente' | 'pago' | 'cancelado' | 'expirado' | 'desconhecido' {
    if (gateway === 'lytex') {
      switch (status) {
        case 'pendente': return 'pendente';
        case 'pago': return 'pago';
        case 'cancelado': return 'cancelado';
        case 'expirado': return 'expirado';
        default: return 'desconhecido';
      }
    } else if (gateway === 'infinitypay') {
      switch (status) {
        case 'pending': return 'pendente';
        case 'paid': return 'pago';
        case 'canceled': return 'cancelado';
        case 'expired': return 'expirado';
        default: return 'desconhecido';
      }
    }
    
    return 'desconhecido';
  }
} 