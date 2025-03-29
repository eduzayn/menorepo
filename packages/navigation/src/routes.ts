import { AppModule, ModuleNavigation } from './types';

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
      { path: '', label: 'Visão Geral', icon: 'home', roles: ['guest', 'aluno', 'professor', 'admin'], isIndex: true },
      { path: '/perfil', label: 'Meu Perfil', icon: 'user', roles: ['guest', 'aluno', 'professor', 'admin'] }
    ]
  },
  'material-didatico': {
    name: 'Material Didático',
    baseRoute: '/material-didatico',
    icon: 'book',
    showInMainMenu: true,
    order: 3,
    routes: [
      { path: '', label: 'Disciplinas', icon: 'book', roles: ['aluno', 'professor', 'admin'], isIndex: true },
      { path: '/criar', label: 'Nova Disciplina', icon: 'plus', roles: ['professor', 'admin'] },
      { path: '/editor', label: 'Editor de Conteúdo', icon: 'edit', roles: ['professor', 'admin'] }
    ]
  },
  matriculas: {
    name: 'Matrículas',
    baseRoute: '/matriculas',
    icon: 'clipboard-list',
    showInMainMenu: true,
    order: 2,
    routes: [
      { path: '', label: 'Minhas Matrículas', icon: 'list', roles: ['aluno'], isIndex: true },
      { path: '/alunos', label: 'Alunos Matriculados', icon: 'users', roles: ['professor', 'admin'] },
      { path: '/nova', label: 'Nova Matrícula', icon: 'plus', roles: ['admin'] }
    ]
  },
  'portal-do-aluno': {
    name: 'Portal do Aluno',
    baseRoute: '/portal-do-aluno',
    icon: 'graduation-cap',
    showInMainMenu: true,
    order: 4,
    routes: [
      { path: '', label: 'Meus Cursos', icon: 'graduation-cap', roles: ['aluno', 'admin'], isIndex: true },
      { path: '/notas', label: 'Notas e Frequência', icon: 'chart-bar', roles: ['aluno', 'admin'] },
      { path: '/documentos', label: 'Documentos', icon: 'file', roles: ['aluno', 'admin'] }
    ]
  },
  comunicacao: {
    name: 'Comunicação',
    baseRoute: '/comunicacao',
    icon: 'message-circle',
    showInMainMenu: true,
    order: 5,
    routes: [
      { path: '', label: 'Mensagens', icon: 'envelope', roles: ['aluno', 'professor', 'admin'], isIndex: true },
      { path: '/nova', label: 'Nova Mensagem', icon: 'plus', roles: ['aluno', 'professor', 'admin'] },
      { path: '/notificacoes', label: 'Notificações', icon: 'bell', roles: ['aluno', 'professor', 'admin'] }
    ]
  },
  'financeiro-empresarial': {
    name: 'Financeiro',
    baseRoute: '/financeiro',
    icon: 'dollar-sign',
    showInMainMenu: true,
    order: 6,
    routes: [
      { path: '', label: 'Resumo', icon: 'money-bill', roles: ['admin'], isIndex: true },
      { path: '/pagamentos', label: 'Meus Pagamentos', icon: 'credit-card', roles: ['aluno'] },
      { path: '/faturamento', label: 'Faturamento', icon: 'file-invoice-dollar', roles: ['admin'] }
    ]
  },
  'portal-parceiro': {
    name: 'Portal do Parceiro',
    baseRoute: '/parceiro',
    icon: 'handshake',
    showInMainMenu: false,
    routes: [
      { path: '', label: 'Dashboard', icon: 'tachometer-alt', roles: ['admin', 'parceiro'], isIndex: true },
      { path: '/alunos', label: 'Meus Alunos', icon: 'users', roles: ['admin', 'parceiro'] },
      { path: '/comissoes', label: 'Comissões', icon: 'percentage', roles: ['admin', 'parceiro'] }
    ]
  },
  'portal-polo': {
    name: 'Portal do Polo',
    baseRoute: '/polo',
    icon: 'map-pin',
    showInMainMenu: false,
    routes: [
      { path: '', label: 'Dashboard', icon: 'tachometer-alt', roles: ['admin', 'polo'], isIndex: true },
      { path: '/alunos', label: 'Alunos', icon: 'users', roles: ['admin', 'polo'] },
      { path: '/eventos', label: 'Eventos', icon: 'calendar', roles: ['admin', 'polo'] }
    ]
  },
  rh: {
    name: 'Recursos Humanos',
    baseRoute: '/rh',
    icon: 'users',
    showInMainMenu: false,
    routes: [
      { path: '', label: 'Colaboradores', icon: 'id-badge', roles: ['admin'], isIndex: true },
      { path: '/folha', label: 'Folha de Pagamento', icon: 'file-invoice-dollar', roles: ['admin'] },
      { path: '/desempenho', label: 'Avaliações', icon: 'chart-line', roles: ['admin'] }
    ]
  },
  contabilidade: {
    name: 'Contabilidade',
    baseRoute: '/contabilidade',
    icon: 'calculator',
    showInMainMenu: false,
    routes: [
      { path: '', label: 'Relatórios', icon: 'chart-pie', roles: ['admin'], isIndex: true },
      { path: '/balancos', label: 'Balanços', icon: 'balance-scale', roles: ['admin'] },
      { path: '/fiscal', label: 'Obrigações Fiscais', icon: 'file-contract', roles: ['admin'] }
    ]
  },
  'site-edunexia': {
    name: 'Site Institucional',
    baseRoute: '/site',
    icon: 'globe',
    showInMainMenu: false,
    routes: [
      { path: '', label: 'Configurações', icon: 'cog', roles: ['admin'], isIndex: true },
      { path: '/leads', label: 'Leads', icon: 'funnel-dollar', roles: ['admin'] },
      { path: '/vendas', label: 'Conversões', icon: 'shopping-cart', roles: ['admin'] }
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
  
  // Feature routes
  AUTH: '/auth',
  PROFILE: '/perfil',
  SETTINGS: '/configuracoes',
  HELP: '/ajuda'
}; 