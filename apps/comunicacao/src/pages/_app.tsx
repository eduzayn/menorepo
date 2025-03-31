import '../styles/globals.css';
import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { ComunicacaoProvider } from '../contexts/ComunicacaoContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Interface simplificada para o hook usePresenca
interface PresencaHook {
  atualizarPresenca: () => void;
}

// Mock do hook usePresenca para desenvolvimento
const usePresenca = (): PresencaHook => {
  return {
    atualizarPresenca: () => console.log('Atualizando presença do usuário')
  };
};

// Cliente QueryClient para React Query
const queryClient = new QueryClient();

// Componente de conteúdo da aplicação com atualização de presença
function AppContent({ Component, pageProps }: AppProps) {
  const { atualizarPresenca } = usePresenca();

  // Atualizar presença ao iniciar a aplicação
  useEffect(() => {
    // Atualiza status de presença ao iniciar
    atualizarPresenca();
    
    // Configura intervalo para atualizar presença a cada 5 minutos
    const interval = setInterval(() => {
      atualizarPresenca();
    }, 5 * 60 * 1000);
    
    // Limpa o intervalo ao desmontar o componente
    return () => clearInterval(interval);
  }, [atualizarPresenca]);

  return <Component {...pageProps} />;
}

// Componente principal da aplicação
export default function App(props: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ComunicacaoProvider>
          <AppContent {...props} />
          <Toaster richColors position="top-right" />
        </ComunicacaoProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
} 