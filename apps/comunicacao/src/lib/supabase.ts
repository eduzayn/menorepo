/**
 * @deprecated Utilizar o cliente centralizado do @edunexia/api-client
 * Este arquivo está mantido para compatibilidade com o código existente.
 * Para novos componentes, utilize o hook/cliente do pacote centralizado:
 * import { useSupabaseClient } from '@edunexia/api-client';
 */

import { createClient } from '@supabase/supabase-js';

// Criando um cliente Supabase mock para desenvolvimento local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Exportando cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função de utilidade para mock de dados durante o desenvolvimento
export const mockData = {
  from: () => ({
    select: () => ({
      order: () => ({
        then: (callback: Function) => callback({
          data: [],
          error: null
        })
      })
    })
  })
};

// Use este cliente mock quando o Supabase não estiver disponível
export const mockSupabase = {
  from: (table: string) => ({
    select: (columns: string) => ({
      order: (column: string) => ({
        then: (callback: Function) => callback({
          data: [],
          error: null
        })
      })
    })
  })
}; 