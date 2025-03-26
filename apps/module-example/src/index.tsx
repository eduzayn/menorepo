import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Provedores de contexto do Core
import { 
  ApiProvider, 
  UserProvider, 
  ThemeProvider, 
  AlertProvider 
} from '@edunexia/core';

// Rotas do módulo
import { ModuleRoutes } from './routes';

// Configurações da API
const apiOptions = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  enableLogging: import.meta.env.DEV,
};

// Cliente do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

// Renderização da aplicação
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Configuração da API */}
      <ApiProvider options={apiOptions}>
        {/* Configuração do React Query */}
        <QueryClientProvider client={queryClient}>
          {/* Configuração de tema */}
          <ThemeProvider defaultTheme="system">
            {/* Autenticação e usuário */}
            <UserProvider>
              {/* Sistema de alertas */}
              <AlertProvider position="top-right">
                {/* Rotas do módulo */}
                <ModuleRoutes />
              </AlertProvider>
            </UserProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ApiProvider>
    </BrowserRouter>
  </React.StrictMode>
);