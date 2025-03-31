import { AppModule, ModuleNavigation } from './types';
import { ModulePermission, UserRole } from '@edunexia/auth';

/**
 * Mapeamento de configurações de navegação por módulo
 */
export const MODULE_CONFIGS: Record<AppModule, ModuleNavigation> = {
  dashboard: {
    name: 'Dashboard',
    baseRoute: '/dashboard',
    icon: 'home',
    showInMainMenu: true,
    order: 1,
    routes: [
      { 
        path: '', 
        label: 'Visão Geral', 
        icon: 'home', 
        roles: ['student', 'teacher', 'institution_admin', 'super_admin'], 
        isIndex: true 
      },
      { 
        path: '/perfil', 
        label: 'Meu Perfil', 
        icon: 'user', 
        roles: ['student', 'teacher', 'institution_admin', 'super_admin'] 
      }
    ]
  },
  'material-didatico': {
    name: 'Material Didático',
    baseRoute: '/material-didatico',
    icon: 'book',
    showInMainMenu: true,
    order: 3,
    requiredPermission: 'material-didatico.view',
    permissions: {
      'material-didatico.view': true,
      'material-didatico.create': true,
      'material-didatico.edit': true,
      'material-didatico.delete': true
    },
    routes: [
      { 
        path: '', 
        label: 'Disciplinas', 
        icon: 'book', 
        roles: ['student', 'teacher', 'institution_admin', 'super_admin'], 
        isIndex: true,
        requiredPermission: 'material-didatico.view'
      },
      { 
        path: '/criar', 
        label: 'Nova Disciplina', 
        icon: 'plus', 
        roles: ['teacher', 'institution_admin', 'super_admin'],
        requiredPermission: 'material-didatico.create'
      },
      { 
        path: '/editor', 
        label: 'Editor de Conteúdo', 
        icon: 'edit', 
        roles: ['teacher', 'institution_admin', 'super_admin'],
        requiredPermission: 'material-didatico.edit'
      }
    ]
  },
  matriculas: {
    name: 'Matrículas',
    baseRoute: '/matriculas',
    icon: 'clipboard-list',
    showInMainMenu: true,
    order: 2,
    requiredPermission: 'matriculas.view',
    permissions: {
      'matriculas.view': true,
      'matriculas.manage': true,
      'matriculas.delete': true
    },
    routes: [
      { 
        path: '', 
        label: 'Minhas Matrículas', 
        icon: 'list', 
        roles: ['student'], 
        isIndex: true,
        requiredPermission: 'matriculas.view'
      },
      { 
        path: '/alunos', 
        label: 'Alunos Matriculados', 
        icon: 'users', 
        roles: ['teacher', 'institution_admin', 'super_admin'],
        requiredPermission: 'matriculas.manage'
      },
      { 
        path: '/nova', 
        label: 'Nova Matrícula', 
        icon: 'plus', 
        roles: ['institution_admin', 'super_admin'],
        requiredPermission: 'matriculas.manage'
      }
    ]
  },
  'portal-do-aluno': {
    name: 'Portal do Aluno',
    baseRoute: '/portal-do-aluno',
    icon: 'graduation-cap',
    showInMainMenu: true,
    order: 4,
    requiredPermission: 'portal-aluno.view',
    permissions: {
      'portal-aluno.view': true,
      'portal-aluno.manage': true
    },
    routes: [
      { 
        path: '', 
        label: 'Meus Cursos', 
        icon: 'graduation-cap', 
        roles: ['student', 'institution_admin', 'super_admin'], 
        isIndex: true,
        requiredPermission: 'portal-aluno.view'
      },
      { 
        path: '/notas', 
        label: 'Notas e Frequência', 
        icon: 'chart-bar', 
        roles: ['student', 'institution_admin', 'super_admin'],
        requiredPermission: 'portal-aluno.view'
      },
      { 
        path: '/documentos', 
        label: 'Documentos', 
        icon: 'file', 
        roles: ['student', 'institution_admin', 'super_admin'],
        requiredPermission: 'portal-aluno.view'
      }
    ]
  },
  comunicacao: {
    name: 'Comunicação',
    baseRoute: '/comunicacao',
    icon: 'message-circle',
    showInMainMenu: true,
    order: 5,
    requiredPermission: 'comunicacao.view',
    permissions: {
      'comunicacao.view': true,
      'comunicacao.manage': true,
      'comunicacao.delete': true
    },
    routes: [
      { 
        path: '', 
        label: 'Mensagens', 
        icon: 'envelope', 
        roles: ['student', 'teacher', 'institution_admin', 'super_admin'], 
        isIndex: true,
        requiredPermission: 'comunicacao.view'
      },
      { 
        path: '/nova', 
        label: 'Nova Mensagem', 
        icon: 'plus', 
        roles: ['student', 'teacher', 'institution_admin', 'super_admin'],
        requiredPermission: 'comunicacao.manage'
      },
      { 
        path: '/notificacoes', 
        label: 'Notificações', 
        icon: 'bell', 
        roles: ['student', 'teacher', 'institution_admin', 'super_admin'],
        requiredPermission: 'comunicacao.view'
      }
    ]
  },
  'financeiro-empresarial': {
    name: 'Financeiro',
    baseRoute: '/financeiro',
    icon: 'dollar-sign',
    showInMainMenu: true,
    order: 6,
    requiredPermission: 'financeiro.view',
    permissions: {
      'financeiro.view': true,
      'financeiro.manage': true,
      'financeiro.delete': true
    },
    routes: [
      { 
        path: '', 
        label: 'Resumo', 
        icon: 'money-bill', 
        roles: ['institution_admin', 'super_admin', 'financial'], 
        isIndex: true,
        requiredPermission: 'financeiro.view'
      },
      { 
        path: '/pagamentos', 
        label: 'Meus Pagamentos', 
        icon: 'credit-card', 
        roles: ['student'],
        requiredPermission: 'financeiro.view'
      },
      { 
        path: '/faturamento', 
        label: 'Faturamento', 
        icon: 'file-invoice-dollar', 
        roles: ['institution_admin', 'super_admin', 'financial'],
        requiredPermission: 'financeiro.manage'
      }
    ]
  },
  'portal-parceiro': {
    name: 'Portal do Parceiro',
    baseRoute: '/parceiro',
    icon: 'handshake',
    showInMainMenu: false,
    routes: [
      { 
        path: '', 
        label: 'Dashboard', 
        icon: 'tachometer-alt', 
        roles: ['institution_admin', 'super_admin'], 
        isIndex: true 
      },
      { 
        path: '/alunos', 
        label: 'Meus Alunos', 
        icon: 'users', 
        roles: ['institution_admin', 'super_admin'] 
      },
      { 
        path: '/comissoes', 
        label: 'Comissões', 
        icon: 'percentage', 
        roles: ['institution_admin', 'super_admin'] 
      }
    ]
  },
  'portal-polo': {
    name: 'Portal do Polo',
    baseRoute: '/polo',
    icon: 'map-pin',
    showInMainMenu: false,
    routes: [
      { 
        path: '', 
        label: 'Dashboard', 
        icon: 'tachometer-alt', 
        roles: ['institution_admin', 'super_admin'], 
        isIndex: true 
      },
      { 
        path: '/alunos', 
        label: 'Alunos', 
        icon: 'users', 
        roles: ['institution_admin', 'super_admin'] 
      },
      { 
        path: '/eventos', 
        label: 'Eventos', 
        icon: 'calendar', 
        roles: ['institution_admin', 'super_admin'] 
      }
    ]
  },
  rh: {
    name: 'Recursos Humanos',
    baseRoute: '/rh',
    icon: 'users',
    showInMainMenu: false,
    routes: [
      { 
        path: '', 
        label: 'Colaboradores', 
        icon: 'id-badge', 
        roles: ['institution_admin', 'super_admin'], 
        isIndex: true 
      },
      { 
        path: '/folha', 
        label: 'Folha de Pagamento', 
        icon: 'file-invoice-dollar', 
        roles: ['institution_admin', 'super_admin'] 
      },
      { 
        path: '/desempenho', 
        label: 'Avaliações', 
        icon: 'chart-line', 
        roles: ['institution_admin', 'super_admin'] 
      }
    ]
  },
  contabilidade: {
    name: 'Contabilidade',
    baseRoute: '/contabilidade',
    icon: 'calculator',
    showInMainMenu: false,
    routes: [
      { 
        path: '', 
        label: 'Relatórios', 
        icon: 'chart-pie', 
        roles: ['institution_admin', 'super_admin'], 
        isIndex: true 
      },
      { 
        path: '/balancos', 
        label: 'Balanços', 
        icon: 'balance-scale', 
        roles: ['institution_admin', 'super_admin'] 
      },
      { 
        path: '/fiscal', 
        label: 'Obrigações Fiscais', 
        icon: 'file-contract', 
        roles: ['institution_admin', 'super_admin'] 
      }
    ]
  },
  'site-edunexia': {
    name: 'Site Institucional',
    baseRoute: '/site',
    icon: 'globe',
    showInMainMenu: false,
    routes: [
      { 
        path: '', 
        label: 'Configurações', 
        icon: 'cog', 
        roles: ['institution_admin', 'super_admin'], 
        isIndex: true 
      },
      { 
        path: '/leads', 
        label: 'Leads', 
        icon: 'funnel-dollar', 
        roles: ['institution_admin', 'super_admin'] 
      },
      { 
        path: '/vendas', 
        label: 'Conversões', 
        icon: 'shopping-cart', 
        roles: ['institution_admin', 'super_admin'] 
      }
    ]
  }
};

/**
 * Função para obter a URL completa de uma rota
 * @param module Módulo desejado
 * @param path Caminho opcional (se omitido, usa a raiz do módulo)
 * @returns URL completa
 */
export function getModuleUrl(module: AppModule, path: string = ''): string {
  const moduleConfig = MODULE_CONFIGS[module];
  return `${moduleConfig.baseRoute}${path}`;
}

/**
 * Constantes para prefixos de rotas comuns
 */
export const ROUTE_PREFIXES = {
  // Modules
  DASHBOARD: '/dashboard',
  MATRICULAS: '/matriculas',
  PORTAL_ALUNO: '/portal-do-aluno',
  COMUNICACAO: '/comunicacao',
  MATERIAL_DIDATICO: '/material-didatico',
  FINANCEIRO: '/financeiro',
  PORTAL_PARCEIRO: '/parceiro',
  PORTAL_POLO: '/polo',
  RH: '/rh',
  CONTABILIDADE: '/contabilidade',
  SITE_ADMIN: '/site-admin',
  CORE_ADMIN: '/admin',
  
  // Feature routes
  AUTH: '/auth',
  PROFILE: '/perfil',
  SETTINGS: '/configuracoes',
  HELP: '/ajuda'
}; 