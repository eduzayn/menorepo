import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppModule, ModuleNavigation } from '../types';
import { MODULE_CONFIGS } from '../routes';

/**
 * Hook para gerenciar navegação entre módulos de forma consistente
 * 
 * @example
 * ```tsx
 * const { navigateToModule, isInModule, getAvailableRoutes } = useNavigation();
 * 
 * // Navegar para outro módulo
 * navigateToModule('material-didatico', '/criar');
 * ```
 */
export function useNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  /**
   * Navega para um módulo específico
   * @param module Módulo de destino
   * @param path Caminho adicional (opcional)
   */
  const navigateToModule = useCallback((module: AppModule, path: string = '') => {
    const moduleConfig = MODULE_CONFIGS[module];
    navigate(`${moduleConfig.baseRoute}${path}`);
  }, [navigate]);
  
  /**
   * Verifica se a rota atual está dentro de um módulo específico
   * @param module Módulo a verificar
   * @returns Boolean indicando se está no módulo
   */
  const isInModule = useCallback((module: AppModule): boolean => {
    const moduleConfig = MODULE_CONFIGS[module];
    return location.pathname.startsWith(moduleConfig.baseRoute);
  }, [location.pathname]);
  
  /**
   * Obtém todas as rotas disponíveis para o papel do usuário
   * @param role Papel do usuário
   * @returns Objeto com as rotas disponíveis por módulo
   */
  const getAvailableRoutes = useCallback((role: string) => {
    const availableModules: Record<string, ModuleNavigation> = {};
    
    Object.entries(MODULE_CONFIGS).forEach(([key, config]) => {
      // Filtra as rotas que o usuário tem permissão
      const availableRoutes = config.routes.filter(route => 
        route.roles.includes(role)
      );
      
      // Se há pelo menos uma rota disponível, adiciona o módulo
      if (availableRoutes.length > 0) {
        availableModules[key] = {
          ...config,
          routes: availableRoutes
        };
      }
    });
    
    return availableModules;
  }, []);
  
  /**
   * Obtém a rota para o módulo atual
   * @returns Informações sobre o módulo atual ou null se não estiver em nenhum módulo
   */
  const getCurrentModule = useCallback((): { module: AppModule; config: ModuleNavigation } | null => {
    for (const [key, config] of Object.entries(MODULE_CONFIGS)) {
      if (location.pathname.startsWith(config.baseRoute)) {
        return {
          module: key as AppModule,
          config
        };
      }
    }
    
    return null;
  }, [location.pathname]);
  
  /**
   * Obtém a rota atual dentro do módulo atual
   * @returns Informações sobre a rota atual ou null se não for encontrada
   */
  const getCurrentRoute = useCallback(() => {
    const currentModule = getCurrentModule();
    
    if (!currentModule) {
      return null;
    }
    
    const { config } = currentModule;
    const routePath = location.pathname.slice(config.baseRoute.length) || '/';
    
    // Procura a rota atual
    for (const route of config.routes) {
      if (routePath === route.path || (routePath === '/' && route.path === '')) {
        return {
          module: currentModule.module,
          moduleConfig: config,
          route
        };
      }
    }
    
    return null;
  }, [getCurrentModule, location.pathname]);
  
  /**
   * Gera um breadcrumb para a rota atual
   * @returns Array com os itens do breadcrumb
   */
  const getBreadcrumbs = useCallback(() => {
    const currentModule = getCurrentModule();
    const currentRoute = getCurrentRoute();
    
    if (!currentModule) {
      return [];
    }
    
    const breadcrumbs = [
      {
        label: 'Home',
        link: '/'
      },
      {
        label: currentModule.config.name,
        link: currentModule.config.baseRoute
      }
    ];
    
    if (currentRoute && currentRoute.route.path !== '') {
      breadcrumbs.push({
        label: currentRoute.route.label,
        link: `${currentModule.config.baseRoute}${currentRoute.route.path}`
      });
    }
    
    return breadcrumbs;
  }, [getCurrentModule, getCurrentRoute]);
  
  /**
   * Obtém os módulos para o menu principal
   * @param role Papel do usuário
   * @returns Array com os módulos disponíveis para o usuário
   */
  const getMainMenuModules = useCallback((role: string) => {
    const availableModules = getAvailableRoutes(role);
    
    return Object.entries(availableModules)
      .filter(([_, config]) => config.showInMainMenu)
      .sort((a, b) => (a[1].order || 99) - (b[1].order || 99))
      .map(([key, config]) => ({
        id: key,
        ...config
      }));
  }, [getAvailableRoutes]);
  
  return {
    navigateToModule,
    isInModule,
    getAvailableRoutes,
    getCurrentModule,
    getCurrentRoute,
    getBreadcrumbs,
    getMainMenuModules
  };
} 