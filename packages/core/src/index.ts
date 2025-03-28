// Exportações de tipos
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
