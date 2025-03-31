/**
 * Configurações de portais do ecossistema Edunexia
 * Este arquivo define todos os portais disponíveis, suas rotas, domínios,
 * e permissões de acesso baseadas em roles.
 */

/**
 * Interface que define a estrutura de configuração de um portal
 */
export interface PortalConfig {
  id: string;
  name: string;
  domain: string;
  basePath: string;
  dashboardPath: string;
  mainComponent?: string;
  icon: string;
  allowedRoles: string[];
  description?: string;
}

/**
 * Lista de portais disponíveis no ecossistema Edunexia
 */
export const PORTAL_OPTIONS: PortalConfig[] = [
  {
    id: 'aluno',
    name: 'Portal do Aluno',
    domain: 'aluno.edunexia.com',
    basePath: '/portal/aluno',
    dashboardPath: '/dashboard',
    mainComponent: 'StudentDashboard',
    icon: '/icons/portal-aluno.svg',
    allowedRoles: ['student', 'parent', 'aluno', 'responsavel'],
    description: 'Acesse suas aulas, notas e documentos'
  },
  {
    id: 'matriculas',
    name: 'Sistema de Matrículas',
    domain: 'matriculas.edunexia.com',
    basePath: '/portal/matriculas',
    dashboardPath: '/dashboard',
    mainComponent: 'EnrollmentDashboard',
    icon: '/icons/matriculas.svg',
    allowedRoles: ['admin', 'secretary', 'coordinator', 'administrador', 'secretaria', 'coordenador'],
    description: 'Gerenciamento de matrículas e processos seletivos'
  },
  {
    id: 'comunicacao',
    name: 'Portal de Comunicação',
    domain: 'comunicacao.edunexia.com',
    basePath: '/portal/comunicacao',
    dashboardPath: '/dashboard',
    mainComponent: 'CommunicationDashboard',
    icon: '/icons/comunicacao.svg',
    allowedRoles: ['teacher', 'admin', 'secretary', 'coordinator', 'professor', 'administrador', 'secretaria', 'coordenador'],
    description: 'Envio de comunicados e notificações'
  },
  {
    id: 'material',
    name: 'Material Didático',
    domain: 'material.edunexia.com',
    basePath: '/portal/material',
    dashboardPath: '/dashboard',
    mainComponent: 'TeachingMaterialDashboard',
    icon: '/icons/material-didatico.svg',
    allowedRoles: ['teacher', 'student', 'admin', 'coordinator', 'professor', 'aluno', 'administrador', 'coordenador'],
    description: 'Criação e acesso a conteúdos didáticos'
  }
];

/**
 * Mapeamento de nomenclaturas de papéis em diferentes sistemas
 */
export const ROLE_MAPPING: Record<string, string> = {
  'aluno': 'student',
  'responsavel': 'parent',
  'professor': 'teacher',
  'coordenador': 'coordinator',
  'secretaria': 'secretary',
  'administrador': 'admin'
};

/**
 * Obtém uma configuração de portal pelo ID
 */
export function getPortalByID(id: string): PortalConfig | undefined {
  return PORTAL_OPTIONS.find(portal => portal.id === id);
}

/**
 * Constrói a URL completa para um portal
 */
export function getFullPortalUrl(portal: PortalConfig): string {
  // Em ambiente de desenvolvimento, usamos subpaths
  if (process.env.NODE_ENV === 'development') {
    return `${window.location.origin}${portal.basePath}`;
  }
  
  // Em produção, usamos subdomínios
  return `https://${portal.domain}`;
}

/**
 * Normaliza o papel do usuário para o padrão do sistema
 */
export function normalizeRole(role: string): string {
  return ROLE_MAPPING[role.toLowerCase()] || role.toLowerCase();
}

/**
 * Verifica se o usuário com determinados papéis pode acessar um portal
 */
export function canAccessPortal(portalId: string, userRoles: string[]): boolean {
  const portal = getPortalByID(portalId);
  if (!portal) return false;
  
  // Normaliza os papéis do usuário
  const normalizedUserRoles = userRoles.map(normalizeRole);
  
  // Verifica se algum dos papéis normalizados está na lista de papéis permitidos do portal
  return portal.allowedRoles.some(role => 
    normalizedUserRoles.includes(normalizeRole(role))
  );
} 