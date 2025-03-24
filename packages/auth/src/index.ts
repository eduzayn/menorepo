import { createClient } from '@supabase/supabase-js';
import type { Database } from '@edunexia/database-schema';

export function createSupabaseClient(url: string, anonKey: string) {
  return createClient<Database>(url, anonKey);
}

export type { Database } from '@edunexia/database-schema';
export { AuthProvider, useAuth } from './AuthContext'; 