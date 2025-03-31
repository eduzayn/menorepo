/**
 * Tipos para os módulos do sistema
 */

import { ModulePermission } from './auth';

export type ModuleId = 
  | 'matriculas'
  | 'portal-aluno'
  | 'material-didatico'
  | 'comunicacao'
  | 'financeiro'
  | 'relatorios'
  | 'configuracoes';

export type MatriculasPermission = 'matriculas.view' | 'matriculas.manage' | 'matriculas.delete';
export type PortalAlunoPermission = 'portal-aluno.view' | 'portal-aluno.manage';
export type MaterialDidaticoPermission = 'material-didatico.view' | 'material-didatico.create' | 'material-didatico.edit' | 'material-didatico.delete';
export type ComunicacaoPermission = 'comunicacao.view' | 'comunicacao.manage' | 'comunicacao.delete';
export type FinanceiroPermission = 'financeiro.view' | 'financeiro.manage' | 'financeiro.delete';
export type RelatoriosPermission = 'relatorios.view' | 'relatorios.generate';
export type ConfiguracoesPermission = 'configuracoes.view' | 'configuracoes.manage';

export type ModulePermissionKey = 
  | MatriculasPermission
  | PortalAlunoPermission
  | MaterialDidaticoPermission
  | ComunicacaoPermission
  | FinanceiroPermission
  | RelatoriosPermission
  | ConfiguracoesPermission;

export interface PortalConfig {
  id: string;
  name: string;
  url: string;
  icon: string;
  description: string;
  permissions: Record<ModulePermissionKey, ModulePermission>;
}

export interface ModuleConfig {
  id: ModuleId;
  name: string;
  description: string;
  icon: string;
  route: string;
  permissions: Partial<Record<ModulePermissionKey, ModulePermission>>;
  requiredPermission?: ModulePermissionKey;
  children?: ModuleConfig[];
}

export interface ModulePermissions {
  read: boolean;
  write: boolean;
  delete: boolean;
}

export function getFullPortalUrl(portalId: string): string;
export function hasModulePermission(moduleId: ModuleId, permission: ModulePermissionKey): boolean;
export function getModuleConfig(moduleId: ModuleId): ModuleConfig | undefined; 