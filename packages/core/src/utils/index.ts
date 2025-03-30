/**
 * ATENÇÃO: ARQUIVO DEPRECIADO
 * 
 * Conforme a arquitetura do projeto:
 * - Funções de formatação e validação não dependentes de UI devem estar em packages/utils
 * - Este arquivo está mantido apenas para compatibilidade
 * 
 * Para TODAS as funções utilitárias, importe diretamente de '@edunexia/utils':
 * import { formatters, validators } from '@edunexia/utils';
 * 
 * Este arquivo será removido em versões futuras.
 */

// Importa os namespaces de formatters e validators
import { 
  formatarData,
  formatarMoeda,
  formatters,
  validators
} from '@edunexia/utils';

// Funções de formatação mantidas para compatibilidade
export const formatCurrency = formatarMoeda;
export const formatDate = formatarData;

// Funções de validação mantidas para compatibilidade
export const validateCPF = validators.isValidCPF;
export const validateCNPJ = validators.isValidCNPJ;
export const isValidCPF = validators.isValidCPF;
export const isValidCNPJ = validators.isValidCNPJ;
export const isValidEmail = validators.isValidEmail;
export const isValidPassword = validators.isValidPassword; 