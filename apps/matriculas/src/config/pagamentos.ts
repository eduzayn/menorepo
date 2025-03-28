/**
 * Configuração dos gateways de pagamento
 * 
 * Este arquivo contém as configurações necessárias para integração
 * com os gateways de pagamento suportados pela plataforma.
 * 
 * IMPORTANTE: As credenciais devem ser armazenadas em variáveis de ambiente
 * e nunca diretamente no código.
 */

interface GatewayConfig {
  nome: string;
  ativo: boolean;
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}

export const gatewaysConfig: Record<string, GatewayConfig> = {
  lytex: {
    nome: 'Lytex',
    ativo: import.meta.env.VITE_LYTEX_ATIVO === 'true',
    baseUrl: import.meta.env.VITE_LYTEX_BASE_URL || 'https://api.lytex.com.br',
    clientId: import.meta.env.VITE_LYTEX_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_LYTEX_CLIENT_SECRET || '',
    callbackUrl: import.meta.env.VITE_LYTEX_CALLBACK_URL || '',
  },
  infinitepay: {
    nome: 'InfinitePay',
    ativo: import.meta.env.VITE_INFINITEPAY_ATIVO === 'true',
    baseUrl: import.meta.env.VITE_INFINITEPAY_BASE_URL || 'https://api.infinitepay.io',
    clientId: import.meta.env.VITE_INFINITEPAY_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_INFINITEPAY_CLIENT_SECRET || '',
    callbackUrl: import.meta.env.VITE_INFINITEPAY_CALLBACK_URL || '',
  }
};

/**
 * Retorna a configuração para um gateway específico
 */
export function getGatewayConfig(gateway: 'lytex' | 'infinitepay'): GatewayConfig {
  return gatewaysConfig[gateway];
}

/**
 * Retorna todos os gateways ativos
 */
export function getGatewaysAtivos(): GatewayConfig[] {
  return Object.values(gatewaysConfig).filter(gateway => gateway.ativo);
}

/**
 * Valida se o gateway está corretamente configurado
 */
export function validarConfigGateway(gateway: 'lytex' | 'infinitepay'): boolean {
  const config = gatewaysConfig[gateway];
  return !!(config.ativo && config.clientId && config.clientSecret && config.callbackUrl);
} 