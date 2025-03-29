import { createClient } from '@supabase/supabase-js';
// Recupera as variáveis de ambiente para a conexão com o Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
// Verifica se as variáveis de ambiente estão presentes
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Erro: Variáveis de ambiente do Supabase não configuradas.', 'Verifique seu arquivo .env e adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
}
// Cria o cliente do Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
    },
});
// Função de utilidade para lidar com erros do Supabase
export const handleSupabaseError = (error) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error('Erro Supabase:', error);
    }
    return {
        message: error.message || 'Ocorreu um erro no servidor',
        code: error.code || 'unknown_error',
        status: error.status || 500,
    };
};
