import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@edunexia/database-schema';

// Tipagem para variáveis de ambiente
declare global {
  interface ImportMeta {
    env: {
      VITE_SUPABASE_URL?: string;
      VITE_SUPABASE_ANON_KEY?: string;
    }
  }
}

/**
 * Cria uma instância do cliente Supabase com configurações padrão
 * 
 * @returns Cliente Supabase configurado
 */
export function createSupabaseClient(): SupabaseClient<Database> {
  // Obter as variáveis de ambiente para o Supabase
  const supabaseUrl = 
    (typeof import.meta !== 'undefined' ? import.meta.env.VITE_SUPABASE_URL : undefined) || 
    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL : undefined) || 
    '';
    
  const supabaseKey = 
    (typeof import.meta !== 'undefined' ? import.meta.env.VITE_SUPABASE_ANON_KEY : undefined) || 
    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined) || 
    '';
  
  // Validar se as variáveis estão disponíveis
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL ou API Key não estão definidos nas variáveis de ambiente');
    throw new Error('Configuração do Supabase incompleta');
  }
  
  // Criar e retornar o cliente
  return createClient<Database>(supabaseUrl, supabaseKey);
} 