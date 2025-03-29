/**
 * Prefixos de Rota para cada Módulo da Edunéxia
 * 
 * Este arquivo define os prefixos de rota padronizados para cada módulo,
 * evitando conflitos quando múltiplos módulos são servidos sob o mesmo domínio.
 * 
 * Para mais detalhes sobre a padronização de rotas, consulte:
 * docs/arquitetura/padronizacao-rotas.md
 */

export const ROUTE_PREFIXES = {
  // Módulos de aplicação
  MATRICULAS: '/matriculas',
  PORTAL_ALUNO: '/aluno',
  COMUNICACAO: '/comunicacao',
  FINANCEIRO: '/financeiro',
  PORTAL_PARCEIRO: '/parceiro',
  PORTAL_POLO: '/polo',
  RH: '/rh',
  CONTABILIDADE: '/contabilidade',
  MATERIAL_DIDATICO: '/conteudo',
  SITE_ADMIN: '/site-admin',
  CORE_ADMIN: '/admin',

  // Prefixos auxiliares
  AUTH: '/auth', // Para ser usado como: `${ROUTE_PREFIXES.MATRICULAS}${ROUTE_PREFIXES.AUTH}/login`
} as const;

/**
 * Tipo de módulo que utiliza o sistema de rotas
 * Use para tipar parâmetros que aceitam nomes de módulos
 */
export type ModuleName = keyof typeof ROUTE_PREFIXES;

/**
 * Gera uma rota completa com o prefixo do módulo
 * @param module O nome do módulo
 * @param path O caminho dentro do módulo (sem a barra inicial)
 * @returns A rota completa com o prefixo
 * 
 * @example
 * ```tsx
 * // Retorna '/matriculas/dashboard'
 * const dashboardRoute = buildModuleRoute('MATRICULAS', 'dashboard');
 * ```
 */
export function buildModuleRoute(module: ModuleName, path: string): string {
  const prefix = ROUTE_PREFIXES[module];
  // Remove barras duplas se o path começar com '/'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${prefix}${normalizedPath}`;
}

/**
 * Gera uma rota de autenticação para o módulo
 * @param module O nome do módulo
 * @param authPath O caminho da autenticação (sem a barra inicial)
 * @returns A rota de autenticação completa
 * 
 * @example
 * ```tsx
 * // Retorna '/matriculas/auth/login'
 * const loginRoute = buildAuthRoute('MATRICULAS', 'login');
 * ```
 */
export function buildAuthRoute(module: ModuleName, authPath: string): string {
  const prefix = ROUTE_PREFIXES[module];
  const normalizedPath = authPath.startsWith('/') ? authPath : `/${authPath}`;
  return `${prefix}${ROUTE_PREFIXES.AUTH}${normalizedPath}`;
} 