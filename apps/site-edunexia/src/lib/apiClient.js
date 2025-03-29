/**
 * Este arquivo configura o cliente de API e provedor React Query
 * Feito para simplificar a integração do site-edunexia com o monorepo
 */
import { QueryClient } from '@tanstack/react-query';
import { createApiClient } from '@edunexia/api-client/src/client';
// Configuração da URL e chave anônima do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://npiyusbnaaibibcucspv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5waXl1c2JuYWFpYmliY3Vjc3B2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MzM1MjgsImV4cCI6MjA1ODQwOTUyOH0.VXME6a0EldkPAXHiF3S2PcEaHA_EoXHQJ1YzKV9_fsU';
// Criar instância do cliente API que usa o Supabase internamente
export const apiClient = createApiClient({
    supabaseUrl,
    supabaseAnonKey,
    enableLogging: import.meta.env.DEV, // Habilitar logs apenas em desenvolvimento
    onError: (error) => {
        console.error('[API Error]:', error);
        // Adicionalmente poderia enviar o erro para um serviço de monitoramento como Sentry
    }
});
// Acesso direto ao cliente Supabase (caso necessário)
export const supabase = apiClient.supabase;
// Função para criar um cliente React Query
export function createQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 1,
                staleTime: 5 * 60 * 1000, // 5 minutos
            },
        },
    });
}
