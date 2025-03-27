import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';

interface ConfigurationsState {
  soundEnabled: boolean;
  soundVolume: number;
  desktopNotifications: boolean;
  darkMode: boolean;
}

interface ConfigContextType {
  config: ConfigurationsState;
  updateConfig: (newConfig: Partial<ConfigurationsState>) => Promise<void>;
  loading: boolean;
}

const defaultConfig: ConfigurationsState = {
  soundEnabled: true,
  soundVolume: 0.5,
  desktopNotifications: true,
  darkMode: false,
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [config, setConfig] = useState<ConfigurationsState>(defaultConfig);
  const [loading, setLoading] = useState(true);

  // Carregar configurações do usuário do Supabase
  useEffect(() => {
    const loadConfig = async () => {
      if (!user) {
        setConfig(defaultConfig);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('configuracoes_usuario')
          .select('*')
          .eq('usuario_id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // Registro não encontrado, criar configurações padrão
            await supabase.from('configuracoes_usuario').insert([
              {
                usuario_id: user.id,
                ...defaultConfig,
              },
            ]);
            setConfig(defaultConfig);
          } else {
            console.error('Erro ao carregar configurações:', error);
          }
        } else if (data) {
          // Configurações carregadas com sucesso
          setConfig({
            soundEnabled: data.sound_enabled ?? defaultConfig.soundEnabled,
            soundVolume: data.sound_volume ?? defaultConfig.soundVolume,
            desktopNotifications: data.desktop_notifications ?? defaultConfig.desktopNotifications,
            darkMode: data.dark_mode ?? defaultConfig.darkMode,
          });
        }
      } catch (err) {
        console.error('Erro ao carregar configurações:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [user]);

  // Atualizar configurações
  const updateConfig = async (newConfig: Partial<ConfigurationsState>) => {
    if (!user) return;

    try {
      const updatedConfig = { ...config, ...newConfig };
      setConfig(updatedConfig);

      // Salvar no Supabase
      const { error } = await supabase
        .from('configuracoes_usuario')
        .upsert({
          usuario_id: user.id,
          sound_enabled: updatedConfig.soundEnabled,
          sound_volume: updatedConfig.soundVolume,
          desktop_notifications: updatedConfig.desktopNotifications,
          dark_mode: updatedConfig.darkMode,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Erro ao salvar configurações:', error);
        // Reverter mudanças em caso de erro
        setConfig(config);
      }
    } catch (err) {
      console.error('Erro ao atualizar configurações:', err);
    }
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, loading }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig deve ser usado dentro de um ConfigProvider');
  }
  return context;
} 