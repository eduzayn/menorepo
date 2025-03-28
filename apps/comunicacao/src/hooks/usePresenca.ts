import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const INTERVALO_ATUALIZACAO = 30000; // 30 segundos
const TEMPO_OFFLINE = 60000; // 1 minuto

export function usePresenca() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Função para atualizar presença
    const atualizarPresenca = async () => {
      try {
        await supabase.rpc('atualizar_presenca', {
          p_usuario_id: user.id,
          p_tipo: 'USUARIO',
          p_online: true
        });
      } catch (error) {
        console.error('Erro ao atualizar presença:', error);
      }
    };

    // Atualizar presença imediatamente
    atualizarPresenca();

    // Configurar intervalo de atualização
    const interval = setInterval(atualizarPresenca, INTERVALO_ATUALIZACAO);

    // Configurar eventos de visibilidade
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        atualizarPresenca();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Configurar eventos de foco
    const handleFocus = () => {
      atualizarPresenca();
    };

    window.addEventListener('focus', handleFocus);

    // Configurar eventos antes de sair
    const handleBeforeUnload = async () => {
      try {
        await supabase.rpc('atualizar_presenca', {
          p_usuario_id: user.id,
          p_tipo: 'USUARIO',
          p_online: false
        });
      } catch (error) {
        console.error('Erro ao atualizar presença:', error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Limpar eventos e intervalo
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [user]);

  // Inscrever-se em mudanças de presença
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('presenca')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'presenca'
      }, (payload) => {
        // Aqui você pode adicionar lógica para lidar com mudanças de presença
        // Por exemplo, atualizar o estado global da aplicação
        console.log('Mudança de presença:', payload);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);
} 