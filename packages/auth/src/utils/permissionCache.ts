import { ModulePermissions } from '../types';

interface CacheEntry {
  permissions: ModulePermissions;
  timestamp: number;
}

class PermissionCache {
  private static instance: PermissionCache;
  private cache: Map<string, CacheEntry>;
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hora em milissegundos

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): PermissionCache {
    if (!PermissionCache.instance) {
      PermissionCache.instance = new PermissionCache();
    }
    return PermissionCache.instance;
  }

  /**
   * Armazena permissões no cache
   */
  public set(userId: string, permissions: ModulePermissions): void {
    this.cache.set(userId, {
      permissions,
      timestamp: Date.now()
    });
  }

  /**
   * Recupera permissões do cache
   */
  public get(userId: string): ModulePermissions | null {
    const entry = this.cache.get(userId);
    
    if (!entry) {
      return null;
    }

    // Verificar se o cache expirou
    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(userId);
      return null;
    }

    return entry.permissions;
  }

  /**
   * Remove permissões do cache
   */
  public remove(userId: string): void {
    this.cache.delete(userId);
  }

  /**
   * Limpa todo o cache
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Verifica se existem permissões em cache para um usuário
   */
  public has(userId: string): boolean {
    const entry = this.cache.get(userId);
    
    if (!entry) {
      return false;
    }

    // Verificar se o cache expirou
    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(userId);
      return false;
    }

    return true;
  }

  /**
   * Atualiza o timestamp de uma entrada no cache
   */
  public refresh(userId: string): void {
    const entry = this.cache.get(userId);
    
    if (entry) {
      entry.timestamp = Date.now();
    }
  }

  /**
   * Retorna o número de entradas no cache
   */
  public size(): number {
    return this.cache.size;
  }

  /**
   * Retorna todas as chaves (userIds) no cache
   */
  public keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

export const permissionCache = PermissionCache.getInstance(); 