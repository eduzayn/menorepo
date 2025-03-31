import React, { createContext, useContext, useState, ReactNode } from 'react';
import { comunicacaoMock } from './comunicacao-mock';

// Tipos básicos
interface IniciarConversaParams {
  participante_id: string;
  participante_tipo: 'LEAD' | 'ALUNO';
  titulo: string;
  canal: string;
}

interface ComunicacaoContextType {
  loading: boolean;
  error: Error | null;
  iniciarConversa: (params: IniciarConversaParams) => Promise<string | null>;
}

// Criação do contexto
export const ComunicacaoContext = createContext<ComunicacaoContextType | undefined>(undefined);

// Props do provider
interface ComunicacaoProviderProps {
  children: ReactNode;
}

// Provider component
export function ComunicacaoProvider({ children }: ComunicacaoProviderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Função para iniciar uma conversa - versão mockada
  const iniciarConversa = async (params: IniciarConversaParams): Promise<string | null> => {
    try {
      setLoading(true);
      console.log('Iniciando conversa:', params);
      
      // Simulando uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Retornando um ID simulado de conversa
      const conversaId = `conv-${Date.now()}`;
      return conversaId;
    } catch (err) {
      console.error('Erro ao iniciar conversa:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Retornando o provider com o valor do contexto
  return (
    <ComunicacaoContext.Provider value={{ 
      loading, 
      error,
      iniciarConversa
    }}>
      {children}
    </ComunicacaoContext.Provider>
  );
}

// Hook para usar o contexto
export function useComunicacao() {
  const context = useContext(ComunicacaoContext);
  
  if (context === undefined) {
    console.warn('useComunicacao está sendo usado fora do ComunicacaoProvider, usando versão mock');
    // Usar versão mock em desenvolvimento para evitar erros
    return comunicacaoMock;
  }
  
  return context;
} 