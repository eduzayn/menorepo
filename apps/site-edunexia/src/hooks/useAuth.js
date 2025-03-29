import { useState, useEffect, useCallback } from 'react';
// Mock de usuário para desenvolvimento
const MOCK_ADMIN_USER = {
    id: '1',
    nome: 'Administrador',
    email: 'admin@edunexia.com',
    perfil: 'admin',
    permissoes: ['gerenciar_site', 'publicar_conteudo', 'gerenciar_usuarios'],
    avatar_url: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff',
};
export function useAuth() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Verifica se o usuário está autenticado ao carregar
    useEffect(() => {
        try {
            // Verificar se há um usuário no localStorage (para persistência da sessão)
            const storedUser = localStorage.getItem('edunexia_site_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
        catch (err) {
            console.error('Erro ao verificar autenticação:', err);
            setError(err instanceof Error ? err : new Error('Erro ao verificar autenticação'));
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    // Realiza login
    const signIn = useCallback(async (credentials) => {
        setIsLoading(true);
        setError(null);
        try {
            // Em produção, isso seria uma chamada a uma API real
            // Simulação de login para desenvolvimento
            if (credentials.email === 'admin@edunexia.com' && credentials.password === 'admin123') {
                // Salvar usuário no localStorage
                localStorage.setItem('edunexia_site_user', JSON.stringify(MOCK_ADMIN_USER));
                setUser(MOCK_ADMIN_USER);
                return {
                    user: MOCK_ADMIN_USER,
                    error: null
                };
            }
            throw new Error('Credenciais inválidas');
        }
        catch (err) {
            const errorObj = err instanceof Error ? err : new Error('Erro desconhecido ao fazer login');
            setError(errorObj);
            return {
                user: null,
                error: errorObj
            };
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    // Realiza logout
    const signOut = useCallback(async () => {
        try {
            // Remover usuário do localStorage
            localStorage.removeItem('edunexia_site_user');
            setUser(null);
            return true;
        }
        catch (err) {
            console.error('Erro ao fazer logout:', err);
            return false;
        }
    }, []);
    // Verifica se o usuário tem permissão específica
    const hasPermission = useCallback((permission) => {
        if (!user || !user.permissoes) {
            return false;
        }
        return user.permissoes.includes(permission);
    }, [user]);
    return {
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        signIn,
        signOut,
        hasPermission
    };
}
