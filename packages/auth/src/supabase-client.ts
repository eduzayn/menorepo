import type { Database } from '@edunexia/database-schema';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Cria uma instância do cliente Supabase com configurações padrão
 * 
 * @returns Cliente Supabase configurado
 */
export function createSupabaseClient(): SupabaseClient<Database> {
  // Obter as variáveis de ambiente para o Supabase
  const supabaseUrl = getEnvVariable('VITE_SUPABASE_URL') || 
    getEnvVariable('NEXT_PUBLIC_SUPABASE_URL') || 
    '';
    
  const supabaseKey = getEnvVariable('VITE_SUPABASE_ANON_KEY') || 
    getEnvVariable('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 
    '';
  
  // Validar se as variáveis estão disponíveis
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL ou API Key não estão definidos nas variáveis de ambiente');
    throw new Error('Configuração do Supabase incompleta');
  }
  
  // Criar e retornar o cliente
  return createClient<Database>(supabaseUrl, supabaseKey);
}

/**
 * Função auxiliar para obter variáveis de ambiente de diferentes fontes
 * (Vite, Next.js, etc.)
 */
function getEnvVariable(name: string): string | undefined {
  // Tentar obter do Vite (import.meta.env)
  if (typeof import.meta !== 'undefined' && 
      Object.prototype.hasOwnProperty.call(import.meta, 'env') &&
      Object.prototype.hasOwnProperty.call((import.meta as any).env, name)) {
    return (import.meta as any).env[name];
  }
  
  // Tentar obter do Node.js (process.env)
  if (typeof process !== 'undefined' && 
      process.env && 
      Object.prototype.hasOwnProperty.call(process.env, name)) {
    return process.env[name];
  }
  
  return undefined;
} 