/**
 * Tipos para navegação na plataforma Edunéxia
 */

import { ModulePermission, UserRole } from '@edunexia/auth';

/**
 * Tipo dos módulos disponíveis no sistema
 */
export type AppModule = 
  | 'dashboard'
  | 'material-didatico'
  | 'matriculas'
  | 'portal-do-aluno'
  | 'comunicacao'
  | 'financeiro-empresarial'
  | 'portal-parceiro'
  | 'portal-polo'
  | 'rh'
  | 'contabilidade'
  | 'site-edunexia';

/**
 * Tipo legado para nomes de módulos em maiúsculas (compatibilidade com o pacote auth)
 * @deprecated Use AppModule no lugar. Será removido em versões futuras.
 */
export type ModuleName = 
  | 'MATRICULAS'
  | 'PORTAL_ALUNO' 
  | 'COMUNICACAO'
  | 'FINANCEIRO'
  | 'PORTAL_PARCEIRO'
  | 'PORTAL_POLO'
  | 'RH'
  | 'CONTABILIDADE'
  | 'MATERIAL_DIDATICO'
  | 'SITE_ADMIN'
  | 'CORE_ADMIN';

/**
 * Interface para representar a estrutura de navegação entre módulos
 */
export interface ModuleNavigation {
  /** Nome do módulo */
  name: string;
  
  /** Rota base do módulo */
  baseRoute: string;
  
  /** Rota relativa (opcional, para módulos com sub-rotas) */
  relativePath?: string;
  
  /** Rotas adicionais do módulo */
  routes: ModuleRoute[];

  /** Ícone do módulo (opcional) */
  icon?: string;
  
  /** Ordem de exibição (opcional) */
  order?: number;
  
  /** Determina se o módulo deve ser exibido no menu principal */
  showInMainMenu?: boolean;
  
  /** Metadados adicionais (opcional) */
  metadata?: Record<string, any>;

  /** Permissões necessárias para acessar o módulo */
  permissions?: Partial<Record<ModulePermission, boolean>>;

  /** Permissão mínima necessária para acessar o módulo */
  requiredPermission?: ModulePermission;
}

/**
 * Interface para rota de módulo
 */
export interface ModuleRoute {
  /** Caminho relativo à baseRoute */
  path: string;
  
  /** Nome exibido para o usuário */
  label: string;
  
  /** Ícone (opcional) */
  icon?: string;
  
  /** Papéis que têm permissão para acessar */
  roles: UserRole[];
  
  /** Determina se a rota é a página inicial do módulo */
  isIndex?: boolean;
  
  /** Sub-rotas (opcional) */
  children?: ModuleRoute[];
  
  /** Metadados adicionais (opcional) */
  metadata?: Record<string, any>;

  /** Permissões necessárias para acessar a rota */
  permissions?: Partial<Record<ModulePermission, boolean>>;

  /** Permissão mínima necessária para acessar a rota */
  requiredPermission?: ModulePermission;
} 