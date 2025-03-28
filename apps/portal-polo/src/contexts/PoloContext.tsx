import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuthPolo, usePoloData } from '../hooks';
import { Polo } from '@edunexia/api-client/src/services/polos';

interface PoloContextProps {
  // Polo atual selecionado
  currentPoloId: string | null;
  setCurrentPoloId: (id: string | null) => void;
  
  // Dados do polo
  poloData: Polo | null;
  
  // Estado de carregamento
  isLoading: boolean;
  
  // Erros
  error: Error | null;
  
  // Acesso e permissões
  isPolo: boolean;
  isAdmin: boolean;
  hasAccess: boolean;
  perfil: string;
  
  // Refresh de dados
  refreshData: () => void;
}

const PoloContext = createContext<PoloContextProps | undefined>(undefined);

interface PoloProviderProps {
  children: ReactNode;
}

/**
 * Provedor de contexto para dados do polo atual
 */
export function PoloProvider({ children }: PoloProviderProps) {
  const [manuallySelectedPoloId, setManuallySelectedPoloId] = useState<string | null>(null);
  const { poloId: autoDetectedPoloId, isPolo, isAdmin, hasAccess, perfil } = useAuthPolo();
  
  // Se o usuário é de um polo específico, usa o poloId detectado automaticamente
  // Caso contrário (admin da instituição), usa o polo selecionado manualmente
  const effectivePoloId = isPolo ? autoDetectedPoloId : manuallySelectedPoloId;
  
  const { 
    polo: poloData, 
    isLoading,
    error,
    refetch
  } = usePoloData(effectivePoloId);
  
  // Se detectarmos automaticamente o polo do usuário, atualizamos o estado
  useEffect(() => {
    if (isPolo && autoDetectedPoloId && !manuallySelectedPoloId) {
      setManuallySelectedPoloId(autoDetectedPoloId);
    }
  }, [isPolo, autoDetectedPoloId, manuallySelectedPoloId]);
  
  // Função para atualizar manualmente os dados
  const refreshData = () => {
    if (refetch && effectivePoloId) {
      refetch.polo();
      refetch.dashboard();
      refetch.alunos();
      refetch.comissoes();
      refetch.repasses();
    }
  };

  const value = {
    currentPoloId: effectivePoloId,
    setCurrentPoloId: setManuallySelectedPoloId,
    poloData,
    isLoading,
    error,
    isPolo,
    isAdmin,
    hasAccess,
    perfil,
    refreshData
  };

  return (
    <PoloContext.Provider value={value}>
      {children}
    </PoloContext.Provider>
  );
}

/**
 * Hook para acessar o contexto do polo
 */
export function usePoloContext() {
  const context = useContext(PoloContext);
  
  if (context === undefined) {
    throw new Error('usePoloContext deve ser usado dentro de um PoloProvider');
  }
  
  return context;
} 