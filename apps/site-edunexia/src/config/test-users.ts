import type { User } from '@edunexia/auth';

// Lista de usuários de teste com bypass de autenticação
export const TEST_USERS: Record<string, User> = {
  'ana.diretoria@eduzayn.com.br': {
    id: 'test-admin-1',
    email: 'ana.diretoria@eduzayn.com.br',
    name: 'Ana Diretoria',
    role: 'super_admin',
    permissions: [
      // Matrículas
      'matriculas.view',
      'matriculas.manage',
      'matriculas.delete',
      
      // Portal do Aluno
      'portal-aluno.view',
      'portal-aluno.manage',
      
      // Material Didático
      'material-didatico.view',
      'material-didatico.create',
      'material-didatico.edit',
      'material-didatico.delete',
      
      // Comunicação
      'comunicacao.view',
      'comunicacao.manage',
      'comunicacao.delete',
      
      // Financeiro
      'financeiro.view',
      'financeiro.manage',
      'financeiro.delete',
      
      // Relatórios
      'relatorios.view',
      'relatorios.generate',
      
      // Configurações
      'configuracoes.view',
      'configuracoes.manage'
    ],
    preferences: {
      theme: 'light',
      language: 'pt-BR'
    },
    app_metadata: {},
    user_metadata: {
      role: 'super_admin'
    },
    aud: 'authenticated',
    created_at: new Date().toISOString()
  }
};

// Senha de teste para o usuário
export const TEST_USER_PASSWORD = 'Zayn@2025';

// Flag para controlar se o bypass está ativo
export const ENABLE_TEST_BYPASS = true; 