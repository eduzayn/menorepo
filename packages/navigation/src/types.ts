/**
 * Tipos para navegação na plataforma Edunéxia
 */

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
  roles: string[];
  
  /** Determina se a rota é a página inicial do módulo */
  isIndex?: boolean;
  
  /** Sub-rotas (opcional) */
  children?: ModuleRoute[];
  
  /** Metadados adicionais (opcional) */
  metadata?: Record<string, any>;
} 