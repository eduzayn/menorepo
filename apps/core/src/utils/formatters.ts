/**
 * ATENÇÃO: ARQUIVO DEPRECIADO
 * 
 * Conforme a arquitetura do projeto:
 * - Funções de formatação não dependentes de UI devem estar em packages/utils
 * - Este arquivo em apps/core está mantido apenas para compatibilidade
 * 
 * Para TODAS as funções de formatação, importe diretamente de '@edunexia/utils':
 * import { formatCurrency, formatDate, ... } from '@edunexia/utils';
 * 
 * Este arquivo será removido em versões futuras.
 */

// Re-exporta todas as funções do pacote centralizado
export * from '@edunexia/utils';