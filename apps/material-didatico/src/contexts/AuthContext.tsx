import React, { createContext, useContext, useEffect } from 'react';
import { useAuth as useEdunexiaAuth, AuthProvider as EdunexiaAuthProvider } from '@edunexia/auth';
import supabaseService from '@/services/supabase';
import { useDatabase } from '@/services/supabase';

// Contexto para expor funções e dados de autenticação específicos do módulo
type MaterialDidaticoAuthContextType = {
  isAutorized: boolean;
  isLoading: boolean;
  userRole: string | null;
  instituicaoId: string | null;
  hasMaterialPermission: boolean;
};

const MaterialDidaticoAuthContext = createContext<MaterialDidaticoAuthContextType>({
  isAutorized: false,
  isLoading: true,
  userRole: null,
  instituicaoId: null,
  hasMaterialPermission: false,
});

export const MaterialDidaticoAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, session } = useEdunexiaAuth();
  const supabase = useDatabase();
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const [instituicaoId, setInstituicaoId] = React.useState<string | null>(null);
  const [hasMaterialPermission, setHasMaterialPermission] = React.useState(false);

  // Verifica se o usuário tem permissão para acessar o módulo de material didático
  useEffect(() => {
    if (!user) {
      setUserRole(null);
      setInstituicaoId(null);
      setHasMaterialPermission(false);
      return;
    }

    // Inicializa o serviço do Supabase com a instância autenticada
    supabaseService.initialize(supabase);

    // Extrai dados de perfil do JWT
    const getUserProfile = async () => {
      try {
        if (!session) return;

        // Extrai informações do JWT
        const jwt = session.access_token;
        const decoded = JSON.parse(atob(jwt.split('.')[1]));
        
        const role = decoded.role || null;
        const institutionId = decoded.institution_id || null;
        
        setUserRole(role);
        setInstituicaoId(institutionId);
        
        // Verifica se o usuário tem permissão específica para o módulo
        const { data, error } = await supabase
          .rpc('check_permission', {
            p_action: 'access',
            p_resource: 'material_didatico'
          });
          
        if (error) throw error;
        
        setHasMaterialPermission(!!data);
      } catch (err) {
        console.error('Erro ao obter perfil do usuário:', err);
        setHasMaterialPermission(false);
      }
    };

    getUserProfile();
  }, [user, session, supabase]);

  const value = {
    isAutorized: !!user && hasMaterialPermission,
    isLoading,
    userRole,
    instituicaoId,
    hasMaterialPermission,
  };

  return (
    <MaterialDidaticoAuthContext.Provider value={value}>
      {children}
    </MaterialDidaticoAuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useMaterialDidaticoAuth = () => useContext(MaterialDidaticoAuthContext);

// Componente de autenticação completo que combina o provider do pacote auth com o provider específico do módulo
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <EdunexiaAuthProvider>
      <MaterialDidaticoAuthProvider>
        {children}
      </MaterialDidaticoAuthProvider>
    </EdunexiaAuthProvider>
  );
};

// Re-exporta o hook de autenticação do pacote
export const useAuth = useEdunexiaAuth; 