/**
 * Utilitários de validação para o módulo financeiro-empresarial
 * ATENÇÃO: Este arquivo está sendo mantido para compatibilidade.
 * Para novas implementações, utilize as funções de @edunexia/utils diretamente.
 */

import { 
  isValidCPF as isValidCPFUtil,
  isValidCNPJ as isValidCNPJUtil 
} from '@edunexia/utils';

/**
 * Valida se um valor é um CPF válido
 * @param cpf Número de CPF a ser validado
 * @returns true se o CPF for válido, false caso contrário
 * @deprecated Use isValidCPF de '@edunexia/utils'
 */
export function isValidCpf(cpf: string): boolean {
  return isValidCPFUtil(cpf);
}

/**
 * Valida se um valor é um CNPJ válido
 * @param cnpj Número de CNPJ a ser validado
 * @returns true se o CNPJ for válido, false caso contrário
 * @deprecated Use isValidCNPJ de '@edunexia/utils'
 */
export function isValidCnpj(cnpj: string): boolean {
  return isValidCNPJUtil(cnpj);
} 