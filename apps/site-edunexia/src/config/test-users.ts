import { User, UserRole, ModulePermission } from '@edunexia/auth';

const PERMISSIONS: ModulePermission[] = [
  'matriculas.view',
  'matriculas.manage',
  'matriculas.delete',
  'portal-aluno.view',
  'portal-aluno.manage',
  'material-didatico.view',
  'material-didatico.create',
  'material-didatico.edit',
  'material-didatico.delete',
  'comunicacao.view',
  'comunicacao.manage',
  'comunicacao.delete',
  'financeiro.view',
  'financeiro.manage',
  'financeiro.delete',
  'relatorios.view',
  'relatorios.generate',
  'configuracoes.view',
  'configuracoes.manage'
];

export const TEST_USERS: Record<string, User> = {
  admin: {
    id: '1',
    email: 'admin@edunexia.com',
    name: 'Administrador',
    role: 'super_admin' as UserRole,
    permissions: PERMISSIONS,
    preferences: {},
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString()
  }
};

// Senha de teste para o usuário
export const TEST_USER_PASSWORD = 'Zayn@2025';

// Flag para controlar se o bypass está ativo
export const ENABLE_TEST_BYPASS = true; 