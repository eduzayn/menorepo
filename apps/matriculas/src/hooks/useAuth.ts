/**
 * @deprecated Este hook foi substituído pela implementação unificada de @edunexia/auth
 * Importe diretamente: import { useAuth } from '@edunexia/auth'
 * 
 * Este arquivo será removido em versões futuras.
 */

// Re-exportar do pacote compartilhado
import { useAuth as useCentralizedAuth } from '@edunexia/auth';
export const useAuth = useCentralizedAuth;

// Tipos reexportados para compatibilidade
export type UserRole = 'admin' | 'secretaria' | 'financeiro' | 'documentacao' | 'aluno';

// Tipo de usuário para compatibilidade
export interface User {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
} 