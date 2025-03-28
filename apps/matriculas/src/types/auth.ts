// Importando o tipo base de @edunexia/core-types
import { UserRole as CoreUserRole } from '@edunexia/core-types';

/**
 * Enum para papéis (roles) de usuário
 * Mantido para compatibilidade com código existente
 */
export enum UserRole {
  ADMIN = 'admin',
  PROFESSOR = 'professor',
  ALUNO = 'aluno',
  SECRETARIA = 'secretaria',
  FINANCEIRO = 'financeiro'
}
