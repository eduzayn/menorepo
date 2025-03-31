import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://supabase.edunexia.com.br';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || 'public-anon-key';

// Cliente do Supabase para autenticação
export const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos para os dados de usuário
export interface UserData {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  updated_at: string;
} 