import { useEffect, useState } from 'react';
import { useApi } from '@edunexia/api-client';
import { useUser } from '@edunexia/core';

interface PoloUser {
  userId: string;
  poloId: string | null;
  perfil: string;
  isPolo: boolean;
  isAdmin: boolean;
  hasAccess: boolean;
}

/**
 * Hook para verificar se o usuário atual tem acesso ao portal do polo
 * e determinar o tipo de acesso (admin instituição, admin polo, atendente)
 */
export function useAuthPolo() {
  const api = useApi();
  const { user, isAuthenticated, isLoading: isLoadingUser } = useUser();
  const [poloUser, setPoloUser] = useState<PoloUser>({
    userId: '',
    poloId: null,
    perfil: '',
    isPolo: false,
    isAdmin: false,
    hasAccess: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function checkPoloAccess() {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Consulta o perfil do usuário para verificar o tipo de acesso
        const { data: profileData, error: profileError } = await api.supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        const userRole = profileData?.role;
        let poloId = null;
        let perfil = '';
        let isPolo = false;
        let isAdmin = false;
        let hasAccess = false;

        // Administrador da instituição
        if (userRole === 'super_admin' || userRole === 'admin_instituicao') {
          isAdmin = true;
          hasAccess = true;
          perfil = userRole;
        } 
        // Verifica se é um usuário de polo (admin_polo ou atendente_polo)
        else if (userRole === 'admin_polo' || userRole === 'atendente_polo') {
          // Consulta a tabela de usuários_polo para obter o polo vinculado
          const { data: poloData, error: poloError } = await api.supabase
            .from('polos.usuarios_polo')
            .select('*, polos:polos.polos(*)')
            .eq('usuario_id', user.id)
            .eq('ativo', true)
            .single();

          if (poloError && poloError.code !== 'PGRST116') { // Ignora erro de nenhum resultado
            throw poloError;
          }

          if (poloData) {
            poloId = poloData.polo_id;
            perfil = userRole;
            isPolo = true;
            isAdmin = userRole === 'admin_polo';
            hasAccess = true;
          }
        }

        setPoloUser({
          userId: user.id,
          poloId,
          perfil,
          isPolo,
          isAdmin,
          hasAccess
        });

      } catch (error) {
        console.error('Erro ao verificar acesso ao polo:', error);
        setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      } finally {
        setIsLoading(false);
      }
    }

    checkPoloAccess();
  }, [isAuthenticated, user, api.supabase]);

  return { 
    ...poloUser, 
    isLoading: isLoadingUser || isLoading,
    error
  };
} 