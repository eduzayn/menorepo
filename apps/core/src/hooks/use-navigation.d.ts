/**
 * Tipo dos módulos disponíveis no sistema
 */
export type AppModule = 'dashboard' | 'material-didatico' | 'matriculas' | 'portal-do-aluno' | 'comunicacao' | 'financeiro-empresarial' | 'portal-parceiro' | 'portal-polo' | 'rh' | 'contabilidade' | 'site-vendas';
/**
 * Interface para representar a estrutura de navegação entre módulos
 */
export interface ModuleNavigation {
    /** Nome do módulo */
    name: string;
    /** Rota base do módulo */
    baseRoute: string;
    /** Rotas adicionais do módulo */
    routes: {
        /** Caminho relativo à baseRoute */
        path: string;
        /** Nome exibido para o usuário */
        label: string;
        /** Ícone (opcional) */
        icon?: string;
        /** Papéis que têm permissão para acessar */
        roles: string[];
    }[];
}
/**
 * Hook para gerenciar navegação entre módulos de forma consistente
 */
export declare function useNavigation(): {
    navigateToModule: (module: AppModule, path?: string) => void;
    isInModule: (module: AppModule) => boolean;
    getAvailableRoutes: (role: string) => Record<string, ModuleNavigation>;
    getCurrentModule: () => AppModule | null;
    MODULE_CONFIGS: Record<AppModule, ModuleNavigation>;
};
//# sourceMappingURL=use-navigation.d.ts.map