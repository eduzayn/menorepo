// Exportações de tipos
/**
 * @todo Centralizar esta definição
 * Há múltiplas definições de UserRole no monorepo que precisam ser unificadas.
 * A versão principal deveria estar em @edunexia/shared-types.
 * Esta definição está mantida para compatibilidade temporária.
 */
export type UserRole = 
  | 'super_admin'
  | 'admin_instituicao'
  | 'admin_polo'
  | 'atendente_polo'
  | 'aluno'
  | 'professor'
  | 'coordenador'
  | 'parceiro'
  | 'financeiro';

// Exportações de utilitários puros (sem dependência de UI/React)
export * from './utils';

// Exportações das constantes
export * from './constants/route-prefixes';
