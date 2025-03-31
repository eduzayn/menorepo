import { ModuleConfig } from '@/types/modules';
import { ModulePermission } from '@edunexia/auth';
import { AppModule } from '@edunexia/navigation';

export const MODULES: ModuleConfig[] = [
  {
    id: 'matriculas',
    name: 'Sistema de Matrículas',
    description: 'Gerencie todo o processo de matrículas dos alunos',
    icon: 'school',
    route: '/matriculas',
    permissions: {
      'matriculas.view': true,
      'matriculas.manage': true,
      'matriculas.delete': true
    },
    requiredPermission: 'matriculas.view'
  },
  {
    id: 'portal-do-aluno',
    name: 'Portal do Aluno',
    description: 'Acesso ao portal do aluno com informações acadêmicas',
    icon: 'person',
    route: '/portal-aluno',
    permissions: {
      'portal-aluno.view': true,
      'portal-aluno.manage': true
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
      'material-didatico.view': true,
      'material-didatico.create': true,
      'material-didatico.edit': true,
      'material-didatico.delete': true
    },
    requiredPermission: 'material-didatico.view'
  },
  {
    id: 'comunicacao',
    name: 'Comunicação',
    description: 'Sistema de comunicação com alunos e responsáveis',
    icon: 'chat',
    route: '/comunicacao',
    permissions: {
      'comunicacao.view': true,
      'comunicacao.manage': true,
      'comunicacao.delete': true
    },
    requiredPermission: 'comunicacao.view'
  },
  {
    id: 'financeiro-empresarial',
    name: 'Financeiro',
    description: 'Gestão financeira da instituição',
    icon: 'payments',
    route: '/financeiro',
    permissions: {
      'financeiro.view': true,
      'financeiro.manage': true,
      'financeiro.delete': true
    },
    requiredPermission: 'financeiro.view'
  },
  {
    id: 'dashboard',
    name: 'Relatórios',
    description: 'Relatórios e análises do sistema',
    icon: 'assessment',
    route: '/relatorios',
    permissions: {
      'relatorios.view': true,
      'relatorios.generate': true
    },
    requiredPermission: 'relatorios.view'
  },
  {
    id: 'site-edunexia',
    name: 'Configurações',
    description: 'Configurações gerais do sistema',
    icon: 'settings',
    route: '/configuracoes',
    permissions: {
      'configuracoes.view': true,
      'configuracoes.manage': true
    },
    requiredPermission: 'configuracoes.view'
  }
];

export function getModuleConfig(moduleId: AppModule): ModuleConfig | undefined {
  return MODULES.find(module => module.id === moduleId);
}

export function hasModulePermission(moduleId: AppModule, permission: ModulePermission): boolean {
  const module = getModuleConfig(moduleId);
  return module?.permissions[permission] ?? false;
} 