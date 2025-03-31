import { ModuleConfig, ModulePermissionKey } from '@/types/modules';

export const MODULES: ModuleConfig[] = [
  {
    id: 'matriculas',
    name: 'Sistema de Matrículas',
    description: 'Gerencie todo o processo de matrículas dos alunos',
    icon: 'school',
    route: '/matriculas',
    permissions: {
      'matriculas.view': { read: true, write: false, delete: false },
      'matriculas.manage': { read: true, write: true, delete: false },
      'matriculas.delete': { read: true, write: true, delete: true }
    },
    requiredPermission: 'matriculas.view'
  },
  {
    id: 'portal-aluno',
    name: 'Portal do Aluno',
    description: 'Acesso ao portal do aluno com informações acadêmicas',
    icon: 'person',
    route: '/portal-aluno',
    permissions: {
      'portal-aluno.view': { read: true, write: false, delete: false },
      'portal-aluno.manage': { read: true, write: true, delete: true }
    },
    requiredPermission: 'portal-aluno.view'
  },
  {
    id: 'material-didatico',
    name: 'Material Didático',
    description: 'Gerencie os materiais didáticos disponíveis',
    icon: 'book',
    route: '/material-didatico',
    permissions: {
      'material-didatico.view': { read: true, write: false, delete: false },
      'material-didatico.create': { read: true, write: true, delete: false },
      'material-didatico.edit': { read: true, write: true, delete: false },
      'material-didatico.delete': { read: true, write: true, delete: true }
    },
    requiredPermission: 'material-didatico.view'
  },
  {
    id: 'comunicacao',
    name: 'Comunicação',
    description: 'Sistema de comunicação entre alunos, professores e responsáveis',
    icon: 'chat',
    route: '/comunicacao',
    permissions: {
      'comunicacao.view': { read: true, write: false, delete: false },
      'comunicacao.manage': { read: true, write: true, delete: false },
      'comunicacao.delete': { read: true, write: true, delete: true }
    },
    requiredPermission: 'comunicacao.view'
  },
  {
    id: 'financeiro',
    name: 'Financeiro',
    description: 'Gestão financeira e controle de mensalidades',
    icon: 'payments',
    route: '/financeiro',
    permissions: {
      'financeiro.view': { read: true, write: false, delete: false },
      'financeiro.manage': { read: true, write: true, delete: false },
      'financeiro.delete': { read: true, write: true, delete: true }
    },
    requiredPermission: 'financeiro.view'
  },
  {
    id: 'relatorios',
    name: 'Relatórios',
    description: 'Geração e visualização de relatórios',
    icon: 'assessment',
    route: '/relatorios',
    permissions: {
      'relatorios.view': { read: true, write: false, delete: false },
      'relatorios.generate': { read: true, write: true, delete: false }
    },
    requiredPermission: 'relatorios.view'
  },
  {
    id: 'configuracoes',
    name: 'Configurações',
    description: 'Configurações gerais do sistema',
    icon: 'settings',
    route: '/configuracoes',
    permissions: {
      'configuracoes.view': { read: true, write: false, delete: false },
      'configuracoes.manage': { read: true, write: true, delete: true }
    },
    requiredPermission: 'configuracoes.view'
  }
];

export function getModuleConfig(moduleId: string): ModuleConfig | undefined {
  return MODULES.find(module => module.id === moduleId);
}

export function hasModulePermission(moduleId: string, permission: ModulePermissionKey): boolean {
  const module = getModuleConfig(moduleId);
  return module?.permissions[permission]?.read || false;
} 