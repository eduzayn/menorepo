import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './AuthContext';

interface IAContextType {
  iaAtiva: boolean;
  setIaAtiva: (ativa: boolean) => void;
  modoAutomatico: boolean;
  setModoAutomatico: (ativo: boolean) => void;
  nivelConfianca: number;
  setNivelConfianca: (nivel: number) => void;
  carregando: boolean;
  salvarConfiguracoes: () => Promise<void>;
}

interface IAConfiguracoes {
  ativo: boolean;
  modo_automatico: boolean;
  nivel_confianca: number;
  frases_personalizadas: Record<string, string>;
}

const IAContext = createContext<IAContextType>({
  iaAtiva: false,
  setIaAtiva: () => {},
  modoAutomatico: false,
  setModoAutomatico: () => {},
  nivelConfianca: 80,
  setNivelConfianca: () => {},
  carregando: true,
  salvarConfiguracoes: async () => {},
});

export function IAProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [iaAtiva, setIaAtiva] = useState(false);
  const [modoAutomatico, setModoAutomatico] = useState(false);
  const [nivelConfianca, setNivelConfianca] = useState(80);
  const [carregando, setCarregando] = useState(true);

  // Carregar configurações do usuário
  useEffect(() => {
    const carregarConfiguracoes = async () => {
      if (!user) {
        setCarregando(false);
        return;
      }

      setCarregando(true);
      try {
        const { data, error } = await supabase
          .from('ia_configuracoes')
          .select('*')
          .eq('usuario_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setIaAtiva(data.ativo);
          setModoAutomatico(data.modo_automatico);
          setNivelConfianca(data.nivel_confianca);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações de IA:', error);
      } finally {
        setCarregando(false);
      }
    };

    carregarConfiguracoes();
  }, [user]);

  // Salvar configurações do usuário
  const salvarConfiguracoes = async () => {
    if (!user) return;

    try {
      const configuracoes: IAConfiguracoes = {
        ativo: iaAtiva,
        modo_automatico: modoAutomatico,
        nivel_confianca: nivelConfianca,
        frases_personalizadas: {} // Implementação futura
      };

      const { error } = await supabase
        .from('ia_configuracoes')
        .upsert({
          usuario_id: user.id,
          ...configuracoes,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao salvar configurações de IA:', error);
    }
  };

  const value = {
    iaAtiva,
    setIaAtiva,
    modoAutomatico,
    setModoAutomatico,
    nivelConfianca,
    setNivelConfianca,
    carregando,
    salvarConfiguracoes,
  };

  return <IAContext.Provider value={value}>{children}</IAContext.Provider>;
}

export function useIA() {
  const context = useContext(IAContext);
  if (context === undefined) {
    throw new Error('useIA must be used within an IAProvider');
  }
  return context;
} 