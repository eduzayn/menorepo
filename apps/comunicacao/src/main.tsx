import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApiProvider } from '@edunexia/api-client'
import { AuthProvider } from '@edunexia/auth'

// Provedores de contexto dos pacotes específicos
import { 
  ThemeProvider, 
  AlertProvider 
} from '@edunexia/ui-components'

// Componente principal da aplicação
import App from './App'

// Estilos globais
import './styles/globals.css'

// Configurações da API
const apiOptions = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  enableLogging: import.meta.env.DEV,
}

// Cliente do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApiProvider
      supabaseUrl={import.meta.env.VITE_SUPABASE_URL}
      supabaseKey={import.meta.env.VITE_SUPABASE_ANON_KEY}
    >
      <AuthProvider>
        <BrowserRouter>
          {/* Configuração do React Query */}
          <QueryClientProvider client={queryClient}>
            {/* Configuração de tema */}
            <ThemeProvider defaultTheme="system">
              {/* Sistema de alertas */}
              <AlertProvider position="top-right">
                {/* Aplicação */}
                <App />
              </AlertProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </AuthProvider>
    </ApiProvider>
  </React.StrictMode>,
) 