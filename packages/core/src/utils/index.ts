/**
 * ATENÇÃO: ARQUIVO DEPRECIADO
 * 
 * Conforme a arquitetura do projeto:
 * - Funções de formatação e validação não dependentes de UI devem estar em packages/utils
 * - Este arquivo está mantido apenas para compatibilidade
 * 
 * Para TODAS as funções utilitárias, importe diretamente de '@edunexia/utils':
 * import { formatCurrency, formatDate, isValidCPF, isValidEmail, ... } from '@edunexia/utils';
 * 
 * Este arquivo será removido em versões futuras.
 */

// Re-exporta as funções do pacote utils centralizado
import { 
  formatCurrency as formatCurrencyUtil,
  formatDate as formatDateUtil,
  isValidCPF as isValidCPFUtil,
  isValidCNPJ as isValidCNPJUtil,
  isValidEmail as isValidEmailUtil,
  isValidPassword as isValidPasswordUtil
} from '@edunexia/utils';

// Funções de formatação mantidas para compatibilidade
export const formatCurrency = formatCurrencyUtil;
export const formatDate = formatDateUtil;

// Funções de validação mantidas para compatibilidade
export const validateCPF = isValidCPFUtil;
export const validateCNPJ = isValidCNPJUtil;
export const isValidCPF = isValidCPFUtil;
export const isValidCNPJ = isValidCNPJUtil;
export const isValidEmail = isValidEmailUtil;
export const isValidPassword = isValidPasswordUtil; 