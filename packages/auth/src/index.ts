/**
 * Pacote de autenticação para Edunéxia
 */

// Exporta todos os componentes
export * from './components';

// Exporta o cliente Supabase
export * from './supabase-client';

// Exporta tipos
export * from './types';

// Re-exports de tipos com alias para evitar conflitos
export { AuthError } from '@supabase/supabase-js'; 