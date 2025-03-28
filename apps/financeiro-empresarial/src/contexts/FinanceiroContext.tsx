import React, { createContext, useContext, useState, ReactNode } from 'react';

// Interface para o estado do contexto
interface FinanceiroContextData {
  currentView: 'dashboard' | 'contas' | 'boletos' | 'fluxo-caixa';
  setCurrentView: (view: 'dashboard' | 'contas' | 'boletos' | 'fluxo-caixa') => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// Valor padrão do contexto
const defaultContext: FinanceiroContextData = {
  currentView: 'dashboard',
  setCurrentView: () => {},
  isLoading: false,
  setIsLoading: () => {}
};

// Criação do contexto
const FinanceiroContext = createContext<FinanceiroContextData>(defaultContext);

// Interface para as props do provider
interface FinanceiroProviderProps {
  children: ReactNode;
}

/**
 * Provider do contexto financeiro
 * Gerencia o estado global do módulo financeiro-empresarial
 */
export function FinanceiroProvider({ children }: FinanceiroProviderProps) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'contas' | 'boletos' | 'fluxo-caixa'>('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <FinanceiroContext.Provider
      value={{
        currentView,
        setCurrentView,
        isLoading,
        setIsLoading
      }}
    >
      {children}
    </FinanceiroContext.Provider>
  );
}

/**
 * Hook para acessar o contexto financeiro
 * @returns Contexto financeiro
 */
export function useFinanceiroContext() {
  const context = useContext(FinanceiroContext);

  if (!context) {
    throw new Error('useFinanceiroContext deve ser usado dentro de um FinanceiroProvider');
  }

  return context;
}

export default FinanceiroContext; 