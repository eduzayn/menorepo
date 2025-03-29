import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiProvider, ApiOptions } from '@edunexia/api-client';
import { ThemeProvider } from '@edunexia/ui-components';
import { ServicesProvider } from './contexts';
import { ModuleRoutes } from './routes';

// Configuração do cliente de query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
});

// Configuração da API
const apiOptions: ApiOptions = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  enableLogging: import.meta.env.DEV,
};

// Função para renderizar o módulo
export const renderRhModule = (element: HTMLElement) => {
  const root = ReactDOM.createRoot(element);
  
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ApiProvider options={apiOptions}>
            <ThemeProvider>
              <ServicesProvider>
                <ModuleRoutes />
              </ServicesProvider>
            </ThemeProvider>
          </ApiProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

// Renderiza o módulo diretamente se não estiver em produção
if (import.meta.env.MODE !== 'production') {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    renderRhModule(rootElement);
  }
}

// Exportações públicas do módulo
export { ModuleRoutes } from './routes';

// Exportações de componentes
export * from './components';

// Exportações de hooks
export * from './hooks';

// Exportações de serviços
export * from './services';

// Exportações de tipos
export * from './types'; 