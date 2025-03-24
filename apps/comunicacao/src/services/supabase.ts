import { createClient } from '@supabase/supabase-js';
import type { Database } from '@edunexia/database-schema';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Tipos úteis
export type User = Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user'];
export type Session = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']; 