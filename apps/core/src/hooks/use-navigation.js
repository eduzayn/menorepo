import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
/**
 * Mapeamento de configurações de navegação por módulo
 */
const MODULE_CONFIGS = {
    dashboard: {
        name: 'Dashboard',
        baseRoute: '/dashboard',
        routes: [
            { path: '', label: 'Visão Geral', icon: 'home', roles: ['guest', 'aluno', 'professor', 'admin'] },
            { path: '/perfil', label: 'Meu Perfil', icon: 'user', roles: ['guest', 'aluno', 'professor', 'admin'] }
        ]
    },
    'material-didatico': {
        name: 'Material Didático',
        baseRoute: '/material-didatico',
        routes: [
            { path: '', label: 'Disciplinas', icon: 'book', roles: ['aluno', 'professor', 'admin'] },
            { path: '/criar', label: 'Nova Disciplina', icon: 'plus', roles: ['professor', 'admin'] },
            { path: '/editor', label: 'Editor de Conteúdo', icon: 'edit', roles: ['professor', 'admin'] }
        ]
    },
    matriculas: {
        name: 'Matrículas',
        baseRoute: '/matriculas',
        routes: [
            { path: '', label: 'Minhas Matrículas', icon: 'list', roles: ['aluno'] },
            { path: '/alunos', label: 'Alunos Matriculados', icon: 'users', roles: ['professor', 'admin'] },
            { path: '/nova', label: 'Nova Matrícula', icon: 'plus', roles: ['admin'] }
        ]
    },
    'portal-do-aluno': {
        name: 'Portal do Aluno',
        baseRoute: '/portal-do-aluno',
        routes: [
            { path: '', label: 'Meus Cursos', icon: 'graduation-cap', roles: ['aluno', 'admin'] },
            { path: '/notas', label: 'Notas e Frequência', icon: 'chart-bar', roles: ['aluno', 'admin'] },
            { path: '/documentos', label: 'Documentos', icon: 'file', roles: ['aluno', 'admin'] }
        ]
    },
    comunicacao: {
        name: 'Comunicação',
        baseRoute: '/comunicacao',
        routes: [
            { path: '', label: 'Mensagens', icon: 'envelope', roles: ['aluno', 'professor', 'admin'] },
            { path: '/nova', label: 'Nova Mensagem', icon: 'plus', roles: ['aluno', 'professor', 'admin'] },
            { path: '/notificacoes', label: 'Notificações', icon: 'bell', roles: ['aluno', 'professor', 'admin'] }
        ]
    },
    'financeiro-empresarial': {
        name: 'Financeiro',
        baseRoute: '/financeiro',
        routes: [
            { path: '', label: 'Resumo', icon: 'money-bill', roles: ['admin'] },
            { path: '/pagamentos', label: 'Meus Pagamentos', icon: 'credit-card', roles: ['aluno'] },
            { path: '/faturamento', label: 'Faturamento', icon: 'file-invoice-dollar', roles: ['admin'] }
        ]
    },
    'portal-parceiro': {
        name: 'Portal do Parceiro',
        baseRoute: '/parceiro',
        routes: [
            { path: '', label: 'Dashboard', icon: 'tachometer-alt', roles: ['admin', 'parceiro'] },
            { path: '/alunos', label: 'Meus Alunos', icon: 'users', roles: ['admin', 'parceiro'] },
            { path: '/comissoes', label: 'Comissões', icon: 'percentage', roles: ['admin', 'parceiro'] }
        ]
    },
    'portal-polo': {
        name: 'Portal do Polo',
        baseRoute: '/polo',
        routes: [
            { path: '', label: 'Dashboard', icon: 'tachometer-alt', roles: ['admin', 'polo'] },
            { path: '/alunos', label: 'Alunos', icon: 'users', roles: ['admin', 'polo'] },
            { path: '/eventos', label: 'Eventos', icon: 'calendar', roles: ['admin', 'polo'] }
        ]
    },
    rh: {
        name: 'Recursos Humanos',
        baseRoute: '/rh',
        routes: [
            { path: '', label: 'Colaboradores', icon: 'id-badge', roles: ['admin'] },
            { path: '/folha', label: 'Folha de Pagamento', icon: 'file-invoice-dollar', roles: ['admin'] },
            { path: '/desempenho', label: 'Avaliações', icon: 'chart-line', roles: ['admin'] }
        ]
    },
    contabilidade: {
        name: 'Contabilidade',
        baseRoute: '/contabilidade',
        routes: [
            { path: '', label: 'Relatórios', icon: 'chart-pie', roles: ['admin'] },
            { path: '/balancos', label: 'Balanços', icon: 'balance-scale', roles: ['admin'] },
            { path: '/fiscal', label: 'Obrigações Fiscais', icon: 'file-contract', roles: ['admin'] }
        ]
    },
    'site-vendas': {
        name: 'Site de Vendas',
        baseRoute: '/site',
        routes: [
            { path: '', label: 'Configurações', icon: 'cog', roles: ['admin'] },
            { path: '/leads', label: 'Leads', icon: 'funnel-dollar', roles: ['admin'] },
            { path: '/vendas', label: 'Conversões', icon: 'shopping-cart', roles: ['admin'] }
        ]
    }
};
/**
 * Hook para gerenciar navegação entre módulos de forma consistente
 */
export function useNavigation() {
    const navigate = useNavigate();
    const location = useLocation();
    /**
     * Navega para um módulo específico
     * @param module Módulo de destino
     * @param path Caminho adicional (opcional)
     */
    const navigateToModule = useCallback((module, path = '') => {
        const moduleConfig = MODULE_CONFIGS[module];
        navigate(`${moduleConfig.baseRoute}${path}`);
    }, [navigate]);
    /**
     * Verifica se a rota atual está dentro de um módulo específico
     * @param module Módulo a verificar
     * @returns Boolean indicando se está no módulo
     */
    const isInModule = useCallback((module) => {
        const moduleConfig = MODULE_CONFIGS[module];
        return location.pathname.startsWith(moduleConfig.baseRoute);
    }, [location.pathname]);
    /**
     * Obtém todas as rotas disponíveis para o papel do usuário
     * @param role Papel do usuário
     * @returns Objeto com as rotas disponíveis por módulo
     */
    const getAvailableRoutes = useCallback((role) => {
        const availableModules = {};
        Object.entries(MODULE_CONFIGS).forEach(([key, config]) => {
            // Filtra as rotas que o usuário tem permissão
            const availableRoutes = config.routes.filter(route => route.roles.includes(role));
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
     * Obtém o módulo atual
     * @returns O módulo atual ou null se não estiver em nenhum
     */
    const getCurrentModule = useCallback(() => {
        const currentPath = location.pathname;
        const currentModule = Object.entries(MODULE_CONFIGS).find(([_, config]) => currentPath.startsWith(config.baseRoute));
        return currentModule ? currentModule[0] : null;
    }, [location.pathname]);
    return {
        navigateToModule,
        isInModule,
        getAvailableRoutes,
        getCurrentModule,
        MODULE_CONFIGS
    };
}
