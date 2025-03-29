/**
 * @edunexia/utils
 *
 * Utilitários compartilhados para a plataforma Edunéxia
 */

// Exporta todas as funções do arquivo utils/index.ts
export * from './utils';

// Exporta todas as funções específicas de formatação
export * from './formatters';

// Exporta todas as funções específicas de validação
export * from './validators';

// Função de exemplo
export function formatarData(data: Date): string {
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Função de exemplo
export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// Função de exemplo
export function gerarSlug(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Exportação apenas como exemplo
export default {
  formatarData,
  formatarMoeda,
  gerarSlug
}; 