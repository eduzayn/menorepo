/**
 * @edunexia/utils
 *
 * Utilitários compartilhados para a plataforma Edunéxia
 */

// Exportações de utils/index com nomes específicos para evitar ambiguidade
export {
  // Funções essenciais que não conflitam 
  cn,
  generateId,
  delay,
  slugify,
  removeNullValues,
  groupBy,
  sortBy,
  deepMerge,
  debounce,
  throttle,
  shuffle,
  uniqueArray,
  removeAccents
} from './utils/index';

// Exportar formatters individualmente ou como namespace
import * as formattersModule from './formatters';
export const formatters = formattersModule;

// Exportar validators individualmente ou como namespace
import * as validatorsModule from './validators';
export const validators = validatorsModule;

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
  gerarSlug,
  formatters,
  validators
}; 