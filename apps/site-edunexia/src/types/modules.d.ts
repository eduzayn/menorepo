/**
 * Tipos para os módulos do sistema
 */

import { ModulePermission } from '@edunexia/auth';
import { AppModule } from '@edunexia/navigation';

export interface PortalConfig {
  id: string;
  name: string;
  url: string;
  icon: string;
  description: string;
  permissions: Record<ModulePermission, ModulePermission>;
}

export interface ModuleConfig {
  id: AppModule;
  name: string;
  description: string;
  icon: string;
  route: string;
  permissions: Partial<Record<ModulePermission, boolean>>;
  requiredPermission: ModulePermission;
}

export interface ModuleState {
  id: AppModule;
  enabled: boolean;
  visible: boolean;
  permissions: ModulePermission[];
}

export interface ModuleContext {
  modules: ModuleState[];
  setModuleState: (moduleId: AppModule, state: Partial<ModuleState>) => void;
  hasPermission: (moduleId: AppModule, permission: ModulePermission) => boolean;
}

export function getFullPortalUrl(portalId: string): string;
export function hasModulePermission(moduleId: AppModule, permission: ModulePermission): boolean;
export function getModuleConfig(moduleId: AppModule): ModuleConfig | undefined; 