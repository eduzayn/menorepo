/**
 * ATENÇÃO: ARQUIVO DEPRECIADO
 * 
 * Conforme a arquitetura do projeto:
 * - Funções de formatação e validação não dependentes de UI devem estar em packages/utils
 * - Este arquivo está mantido apenas para compatibilidade
 * 
 * Para TODAS as funções utilitárias, importe diretamente de '@edunexia/utils':
 * import { formatCurrency, formatDate, ... } from '@edunexia/utils';
 * 
 * Este arquivo será removido em versões futuras.
 */

// Re-exporta as funções do pacote utils centralizado
import { 
  formatCurrency as formatCurrencyUtil,
  formatDate as formatDateUtil,
  isValidCPF,
  isValidCNPJ
} from '@edunexia/utils';

// Funções de formatação mantidas para compatibilidade
export const formatCurrency = formatCurrencyUtil;
export const formatDate = formatDateUtil;

// Funções de validação mantidas para compatibilidade com nomes antigos
export const validateCPF = isValidCPF;
export const validateCNPJ = isValidCNPJ; 