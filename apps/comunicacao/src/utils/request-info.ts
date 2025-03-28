import { headers } from 'next/headers';

export interface RequestInfo {
  ip: string;
  userAgent: string;
  forwardedFor?: string;
  realIp?: string;
  cfConnectingIp?: string;
  xRealIp?: string;
}

/**
 * Captura informações de IP e User Agent da requisição
 * Suporta diferentes headers comuns de proxy e CDN
 */
export function getRequestInfo(): RequestInfo {
  const headersList = headers();
  
  // Captura User Agent
  const userAgent = headersList.get('user-agent') || '';

  // Captura IP considerando diferentes headers
  const ip = 
    headersList.get('cf-connecting-ip') || // Cloudflare
    headersList.get('x-real-ip') ||        // Nginx
    headersList.get('x-forwarded-for')?.split(',')[0] || // Proxy
    headersList.get('x-client-ip') ||      // Apache
    '127.0.0.1';                          // Fallback

  return {
    ip,
    userAgent,
    forwardedFor: headersList.get('x-forwarded-for') || undefined,
    realIp: headersList.get('x-real-ip') || undefined,
    cfConnectingIp: headersList.get('cf-connecting-ip') || undefined,
    xRealIp: headersList.get('x-real-ip') || undefined
  };
}

/**
 * Valida se o IP está em uma lista de IPs permitidos
 */
export function isIpAllowed(ip: string, allowedIps: string[]): boolean {
  return allowedIps.includes(ip);
}

/**
 * Extrai informações do User Agent
 */
export function parseUserAgent(userAgent: string): {
  browser: string;
  os: string;
  device: string;
  isMobile: boolean;
} {
  // Implementação básica - pode ser melhorada com bibliotecas como ua-parser-js
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
  const browser = userAgent.match(/(Chrome|Safari|Firefox|Edge|MSIE|Trident)\/[\d.]+/)?.[0] || 'Unknown';
  const os = userAgent.match(/(Windows|Macintosh|Linux|Android|iOS|iPadOS)/)?.[0] || 'Unknown';
  
  return {
    browser,
    os,
    device: isMobile ? 'Mobile' : 'Desktop',
    isMobile
  };
} 