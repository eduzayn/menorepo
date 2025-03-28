import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiProvider, UserProvider, ThemeProvider, AlertProvider } from '@edunexia/core';
import { PoloProvider } from './contexts';
import { AppRoutes } from './routes';
import './index.css';

// Configurações da API
const apiOptions = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  enableLogging: true,
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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApiProvider options={apiOptions}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="system">
            <UserProvider>
              <AlertProvider position="top-right">
                <PoloProvider>
                  <AppRoutes />
                </PoloProvider>
              </AlertProvider>
            </UserProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ApiProvider>
    </BrowserRouter>
  </React.StrictMode>
); 