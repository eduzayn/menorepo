/**
 * Serviço Supabase para módulo de comunicação
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Criando um cliente Supabase mock para desenvolvimento local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Exportando cliente Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Mock de dados durante o desenvolvimento
const mockCategories = [
  { 
    id: '1', 
    nome: 'Produtos', 
    descricao: 'Informações sobre os produtos oferecidos', 
    icone: '📦', 
    ordem: 1 
  },
  { 
    id: '2', 
    nome: 'Suporte Técnico', 
    descricao: 'Resolução de problemas técnicos', 
    icone: '🔧', 
    ordem: 2 
  },
  { 
    id: '3', 
    nome: 'Faturamento', 
    descricao: 'Dúvidas sobre pagamentos e faturas', 
    icone: '💰', 
    ordem: 3 
  }
];

// Função de utilidade para mock de dados durante o desenvolvimento
export const mockData = {
  from: (table: string) => {
    // Simular dados de categorias
    if (table === 'base_conhecimento_categorias') {
      return {
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: mockCategories[0], error: null }),
            then: (callback: Function) => callback({ data: mockCategories, error: null })
          }),
          then: (callback: Function) => callback({ data: mockCategories, error: null })
        })
      };
    }
    
    // Retorno padrão para outras tabelas
    return {
      select: () => ({
        order: () => ({
          then: (callback: Function) => callback({
            data: [],
            error: null
          })
        }),
        eq: () => ({
          then: (callback: Function) => callback({
            data: [],
            error: null
          })
        })
      })
    };
  },
  rpc: () => Promise.resolve({ data: null, error: null })
}; 